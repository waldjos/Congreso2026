from docx import Document
import re
import json
from pathlib import Path


def normalize_text(text: str):
    text = text.replace('\u00a0', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def is_day_header(text: str):
    # Detect lines like 'JUEVES 09 JULIO' or 'Jueves 09 Julio'
    return bool(re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ]+\s+\d{1,2}\s+[A-Za-z]+', text.strip()))


def parse_time(text: str):
    m = re.search(r'\b(\d{1,2}:\d{2})(?:\s*(am|pm|AM|PM|a\.m\.|p\.m\.))?\b', text)
    if not m:
        return None

    hour = int(m.group(1).split(':')[0])
    minute = int(m.group(1).split(':')[1])
    suffix = m.group(2)
    if suffix:
        suffix = suffix.lower().replace('.', '')
        if suffix == 'pm' and hour < 12:
            hour += 12
        if suffix == 'am' and hour == 12:
            hour = 0
    return f'{hour:02d}:{minute:02d}'


def is_time_line(text: str):
    return parse_time(text) is not None


def extract_time_and_title(text: str):
    text = normalize_text(text)
    time = parse_time(text)
    if not time:
        return None, normalize_text(text)

    title = re.sub(r'\b\d{1,2}:\d{2}(?:\s*(?:am|pm|AM|PM|a\.m\.|p\.m\.))?\b', '', text)
    title = re.sub(r'^[\s\-–—:]+', '', title)
    title = re.sub(r'^(am|pm|AM|PM)\s*[-–—:\s]+', '', title)
    title = normalize_text(title)
    return time, title


def main():
    docx_path = Path(__file__).parent.parent / 'public' / 'XXXVI CONGRESO NACIONAL DE UROLOGIA-1.docx'
    if not docx_path.exists():
        print('DOCX not found at', docx_path)
        return

    doc = Document(docx_path)
    days = []
    current_day = None
    current_item = None

    for p in doc.paragraphs:
        text = p.text.strip()
        if not text:
            continue

        if is_day_header(text):
            # start new day
            if current_day:
                # push last item if present
                days.append(current_day)
            current_day = {'day': text, 'timeline': []}
            current_item = None
            continue

        if is_time_line(text):
            time, title = extract_time_and_title(text)
            item = {'time': time or '', 'title': title or text, 'details': ''}
            if current_day is None:
                # fallback to a default day
                current_day = {'day': 'Programa', 'timeline': []}
            current_day['timeline'].append(item)
            current_item = item
            continue

        # continuation lines (e.g., speakers, room, description)
        if current_item is not None:
            if current_item['details']:
                current_item['details'] += '\n' + text
            else:
                current_item['details'] = text
        else:
            # paragraph outside a time block: attach to day description
            if current_day is None:
                current_day = {'day': 'Programa', 'timeline': []}
            if 'description' in current_day:
                current_day['description'] += '\n' + text
            else:
                current_day['description'] = text

    if current_day:
        days.append(current_day)

    def dedupe_and_sort(day: dict):
        seen = set()
        timeline = []
        for item in day.get('timeline', []):
            key = (item.get('time', ''), item.get('title', '').strip())
            if key in seen:
                continue
            seen.add(key)
            timeline.append(item)
        day['timeline'] = sorted(timeline, key=lambda item: item.get('time') or '99:99')

    for day in days:
        if 'timeline' in day:
            dedupe_and_sort(day)

    out_path = Path(__file__).parent.parent / 'public' / 'program.json'
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(days, f, ensure_ascii=False, indent=2)

    print('Wrote', out_path)


if __name__ == '__main__':
    main()
