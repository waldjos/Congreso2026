from docx import Document
import re
import json
from pathlib import Path


def is_day_header(text: str):
    # Detect lines like 'JUEVES 09 JULIO' or 'Jueves 09 Julio'
    return bool(re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ]+\s+\d{1,2}\s+[A-Za-z]+', text.strip()))


def is_time_line(text: str):
    return bool(re.search(r'\b\d{1,2}:\d{2}\b', text))


def extract_time_and_title(text: str):
    m = re.search(r'\b(\d{1,2}:\d{2})\b', text)
    if not m:
        return None, text.strip()
    time = m.group(1)
    # remove time from text
    title = text.replace(m.group(0), '').strip(' -–—:')
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

    out_path = Path(__file__).parent.parent / 'public' / 'program.json'
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(days, f, ensure_ascii=False, indent=2)

    print('Wrote', out_path)


if __name__ == '__main__':
    main()
