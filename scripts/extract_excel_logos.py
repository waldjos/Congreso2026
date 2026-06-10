from __future__ import annotations

import argparse
import zipfile
from pathlib import Path


def extract_excel_images(xlsx_path: Path, output_dir: Path) -> list[str]:
    if not xlsx_path.exists() or not xlsx_path.is_file():
        raise FileNotFoundError(f"Excel file not found: {xlsx_path}")

    output_dir.mkdir(parents=True, exist_ok=True)
    extracted_files: list[str] = []

    with zipfile.ZipFile(xlsx_path, 'r') as archive:
        media_entries = [name for name in archive.namelist() if name.startswith('xl/media/')]
        if not media_entries:
            return []

        for media_name in media_entries:
            data = archive.read(media_name)
            dest_name = Path(media_name).name
            dest_path = output_dir / dest_name
            if dest_path.exists():
                base = dest_path.stem
                suffix = dest_path.suffix
                count = 1
                while True:
                    candidate = output_dir / f"{base}-{count}{suffix}"
                    if not candidate.exists():
                        dest_path = candidate
                        break
                    count += 1
            dest_path.write_bytes(data)
            extracted_files.append(dest_path.name)
    return extracted_files


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Extrae imágenes embebidas desde un archivo .xlsx a una carpeta local.'
    )
    parser.add_argument('xlsx', help='Ruta al archivo XLSX de origen')
    parser.add_argument(
        '--out',
        default='public/sponsors',
        help='Carpeta de salida para las imágenes extraídas (por defecto: public/sponsors)',
    )
    args = parser.parse_args()

    xlsx_path = Path(args.xlsx).resolve()
    output_dir = Path(args.out).resolve()

    extracted = extract_excel_images(xlsx_path, output_dir)
    if not extracted:
        print('No se encontraron imágenes en xl/media del archivo .xlsx.')
        return

    print(f'Imágenes extraídas a: {output_dir}')
    for filename in extracted:
        print(f' - {filename}')


if __name__ == '__main__':
    main()
