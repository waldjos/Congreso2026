"""Actualiza logos conocidos con URLs verificadas."""
import warnings
from pathlib import Path

import requests

warnings.filterwarnings("ignore")
S = requests.Session()
S.headers.update({"User-Agent": "Mozilla/5.0"})
S.verify = False
OUT = Path(__file__).resolve().parents[1] / "public" / "sponsors"

LOGOS = {
    "bnh": "https://bnhmedical.com/wp-content/uploads/2024/02/1a.BNH-Medical-2024-Color-S-FondoTransparente-.png",
    "plusandex": "https://plusandex.com/wp-content/uploads/2025/09/Logo-plus-andex-rif-e1756868575371.png",
    "urolatam": "https://urolatam.com/cdn/shop/files/Uro_Logo.jpg?v=1756165163&width=600",
    "zoriak": "https://zoriakpharma.com/wp-content/uploads/2024/04/logo.svg",
}

for sid, url in LOGOS.items():
    r = S.get(url, timeout=20)
    if r.status_code == 200 and len(r.content) > 800:
        ext = ".svg" if url.endswith(".svg") else ".png" if ".png" in url else ".jpg"
        (OUT / f"{sid}{ext}").write_bytes(r.content)
        print(f"OK {sid}{ext} ({len(r.content)} bytes)")
    else:
        print(f"FAIL {sid} {r.status_code}")
