from docx import Document
import re
import json
from pathlib import Path


def normalize_text(text: str):
    text = text.replace('\u00a0', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def normalize_time_string(text: str):
    text = normalize_text(text)
    text = re.sub(r'(\d)\s*[:.]\s*(\d)', r'\1:\2', text)
    text = re.sub(r'\s*[-–—]\s*', ' - ', text)
    return text


def is_day_header(text: str):
    return bool(re.match(r'^(MI[EÉ]RCOLES|JUEVES|VIERNES|S[ÁA]BADO|SABADO|LUNES|MARTES|DOMINGO)\s+\d{1,2}/\d{1,2}/\d{4}', text.strip(), re.I))


def extract_time_range(text: str):
    text = normalize_text(text)
    time_token = r'\d{1,2}(?:\s*[:.\-]\s*\d{2})?\s*(?:am|pm|AM|PM|a\.m\.|p\.m\.|m)?'
    separator = r'[\s\u00A0\uFFFD\-\u2010-\u2015\u2212]+'
    range_match = re.search(
        rf'(?P<start>{time_token}){separator}(?P<end>{time_token})',
        text,
    )
    if range_match:
        start = normalize_time_string(range_match.group('start'))
        end = normalize_time_string(range_match.group('end'))
        title = normalize_text(text.replace(range_match.group(0), '').strip())
        return f'{start} - {end}', title

    single_match = re.search(
        rf'(?<!\d/)(?P<time>{time_token})',
        text,
    )
    if single_match:
        time = normalize_time_string(single_match.group('time'))
        title = normalize_text(text.replace(single_match.group(0), '').strip())
        return time, title

    return None, text


def parse_metadata_line(text: str):
    candidate = normalize_text(text)
    lower = candidate.lower()

    if lower.startswith('valor'):
        value = re.sub(r'^valor\s*[:\s]*', '', candidate, flags=re.I)
        return {'field': 'price', 'value': normalize_text(value)}

    if lower.startswith('sede'):
        rest = re.sub(r'^sede\s*[:\s]*', '', candidate, flags=re.I)
        time, venue_name = extract_time_range(rest)
        venue = venue_name if venue_name else rest
        return {'field': 'venue', 'value': normalize_text(venue), 'time': time}

    return None


def is_ignored_line(text: str):
    upper = normalize_text(text).upper()
    ignored = {
        'XXXVI CONGRESO NACIONAL DE UROLOGIA',
        'DR. NELSON MEDERO',
        'PROGRAMA CIENTIFICO',
        'CURSOS PRECONGRESO',
        'SERVICIOS',
    }
    return upper in ignored


def is_speaker_or_meta_line(text: str):
    lower = normalize_text(text).lower()
    prefixes = [
        'dr.',
        'dra.',
        'dr ',
        'dra ',
        'coordinador',
        'coordinadora',
        'moderador',
        'moderadora',
        'ponente',
        'ponentes',
        'participantes',
        'valor',
        'patrocinado',
        'salones',
        'sociedad',
        'confederacion',
        'european',
        'moderador:',
        'coordinador:',
        'ponente:',
        'participantes:',
    ]
    return any(lower.startswith(prefix) for prefix in prefixes)


def get_or_create_venue(day: dict, venue_name: str):
    if day is None:
        return None
    venue_name = normalize_text(venue_name) if venue_name else 'General'
    if 'venues' not in day:
        day['venues'] = []
    for venue in day['venues']:
        if venue['name'].lower() == venue_name.lower():
            return venue
    new_venue = {'name': venue_name, 'items': []}
    day['venues'].append(new_venue)
    return new_venue


def assign_item_to_venue(item: dict, day: dict, venue_name: str):
    if day is None or item is None:
        return get_or_create_venue(day, venue_name)
    venue = get_or_create_venue(day, venue_name)
    for existing in day.get('venues', []):
        if item in existing.get('items', []):
            existing['items'].remove(item)
            break
    venue['items'].append(item)
    item['venue'] = venue_name
    return venue


def create_day(days: list[dict], text: str):
    normalized = normalize_text(text)
    if days and days[-1].get('day', '').lower() == normalized.lower():
        return days[-1]
    day = {'day': normalized, 'venues': []}
    days.append(day)
    return day


def next_relevant_text(paragraphs: list, start_index: int):
    for idx in range(start_index, len(paragraphs)):
        text = normalize_text(paragraphs[idx].text)
        if not text or is_ignored_line(text):
            continue
        return text
    return None


def should_start_new_item(text: str, current_item: dict | None):
    if current_item is None:
        return True
    if current_item.get('details'):
        lower = normalize_text(text).lower()
        return not is_speaker_or_meta_line(text) and len(text.split()) > 2
    return False


def main():
    docx_path = Path(__file__).parent.parent / 'public' / 'XXXVI CONGRESO NACIONAL DE UROLOGIA-1.docx'
    if not docx_path.exists():
        print('DOCX not found at', docx_path)
        return

    doc = Document(docx_path)
    paragraphs = list(doc.paragraphs)
    days: list[dict] = []
    current_day = None
    current_venue = None
    current_item = None
    pending_venue = None

    for idx, p in enumerate(paragraphs):
        text = normalize_text(p.text)
        if not text:
            continue

        if is_ignored_line(text):
            continue

        if is_day_header(text):
            current_day = create_day(days, text)
            current_venue = None
            current_item = None
            if pending_venue:
                current_venue = get_or_create_venue(current_day, pending_venue)
                pending_venue = None
            continue

        if current_day is None:
            continue

        metadata = parse_metadata_line(text)
        if metadata:
            if metadata['field'] == 'venue':
                next_text = next_relevant_text(paragraphs, idx + 1)
                if next_text and is_day_header(next_text):
                    pending_venue = metadata['value']
                    continue
                current_venue = get_or_create_venue(current_day, metadata['value'])
                if current_item is not None:
                    current_venue = assign_item_to_venue(current_item, current_day, metadata['value'])
                    if metadata.get('time'):
                        current_item['time'] = metadata['time']
                    if current_item.get('details'):
                        current_item['details'] += '\n' + text
                    else:
                        current_item['details'] = text
                continue
            if metadata['field'] == 'price' and current_item is not None:
                current_item['price'] = metadata['value']
                if current_item.get('details'):
                    current_item['details'] += '\n' + text
                else:
                    current_item['details'] = text
                continue

        time, title = extract_time_range(text)
        if time:
            item_title = title or text
            if item_title.lower().startswith('sede'):
                item_title = normalize_text(re.sub(r'^(sede\s*[:\s]*)', '', item_title, flags=re.I))
            if current_venue is None:
                current_venue = get_or_create_venue(current_day, 'General')
            item = {
                'time': time,
                'title': item_title,
                'details': '',
                'venue': current_venue['name'],
            }
            current_venue['items'].append(item)
            current_item = item
            continue

        if should_start_new_item(text, current_item):
            if current_venue is None:
                current_venue = get_or_create_venue(current_day, 'General')
            item = {'time': '', 'title': text, 'details': '', 'venue': current_venue['name']}
            current_venue['items'].append(item)
            current_item = item
            continue

        if current_item is not None:
            if current_item.get('details'):
                current_item['details'] += '\n' + text
            else:
                current_item['details'] = text
        else:
            if 'description' in current_day:
                current_day['description'] += '\n' + text
            else:
                current_day['description'] = text

    def dedupe_items(items: list[dict]):
        seen = set()
        result = []
        for item in items:
            key = (item.get('time', ''), item.get('title', '').strip())
            if key in seen:
                continue
            seen.add(key)
            result.append(item)
        return result

    for day in days:
        for venue in day.get('venues', []):
            venue['items'] = dedupe_items(venue.get('items', []))
        day['venues'] = [venue for venue in day.get('venues', []) if venue.get('items')]

    out_path = Path(__file__).parent.parent / 'public' / 'program.json'
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(days, f, ensure_ascii=False, indent=2)

    print('Wrote', out_path)


if __name__ == '__main__':
    main()
