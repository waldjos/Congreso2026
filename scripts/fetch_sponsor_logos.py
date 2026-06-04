"""Descarga logos de patrocinadores o genera wordmarks SVG de respaldo."""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "sponsors"
OUT.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    )
}

SPONSORS = [
    {"id": "adium", "name": "Adium", "domain": "adium.com.ve"},
    {"id": "calox", "name": "Calox", "domain": "calox.com"},
    {"id": "eurofarma", "name": "Eurofarma", "domain": "eurofarma.com.br"},
    {"id": "leti", "name": "Leti", "domain": "leti.com"},
    {"id": "urogastrol", "name": "Urogastrol", "domain": "urogastrol.com"},
    {"id": "cuevas", "name": "Cuevas", "domain": "cuevas.com.ve"},
    {"id": "bnh", "name": "B.N.H.", "domain": None},
    {"id": "lasermed", "name": "Lasermed", "domain": "lasermed.com.ve"},
    {"id": "angelus", "name": "Angelus", "domain": "angeluscorp.com"},
    {"id": "clinicalar", "name": "Clinicalar", "domain": "clinicalar.net"},
    {"id": "dermaskin", "name": "Dermaskin", "domain": "dermaskin.com.ve"},
    {"id": "cdd", "name": "CDD", "domain": None},
    {"id": "hospitalar", "name": "Hospitalar", "domain": "hospitalar.com.ve"},
    {"id": "evrp", "name": "EVRP", "domain": None},
    {"id": "meditec", "name": "Meditec", "domain": "meditec.com.ve"},
    {"id": "seguros", "name": "Seguros", "domain": None},
    {"id": "gurve", "name": "Gurve", "domain": "gurve.com"},
    {"id": "agpr", "name": "AGPR", "domain": None},
    {"id": "baptista-hospital", "name": "Baptista Hospital", "domain": "baptistahospital.com"},
    {"id": "profimedical", "name": "Profimedical", "domain": "profimedical.com.ve"},
    {"id": "omnimedical", "name": "Omnimedical", "domain": "omnimedical.com.ve"},
    {"id": "urolatam", "name": "Urolatam", "domain": "urolatam.com"},
    {"id": "marmarket", "name": "Marmarket", "domain": "marmarket.com.ve"},
    {"id": "plusandex", "name": "Plusandex", "domain": "plusandex.com"},
    {"id": "endo-master", "name": "Endo Master", "domain": "endomaster.com.ve"},
    {"id": "exxux", "name": "Exxux", "domain": None},
    {"id": "nirvalab", "name": "Nirvalab", "domain": "nirvalab.net"},
    {"id": "farma", "name": "Farma", "domain": None},
    {"id": "valmorca", "name": "Valmorca", "domain": "valmorca.com.ve"},
    {"id": "quirutex", "name": "Quirutex", "domain": "quirutex.com"},
    {"id": "almed", "name": "Almed", "domain": "almed.com.ve"},
    {"id": "badam", "name": "Badam", "domain": None},
    {"id": "imaye", "name": "Imayé", "domain": "imaye.com.ve"},
    {"id": "fc-laboratorios", "name": "F.C. Laboratorios", "domain": "fclaboratorios.com"},
    {"id": "hygea", "name": "Hygea", "domain": "hygea.com.ve"},
    {"id": "dalmed", "name": "Dalmed", "domain": "dalmed.com.ve"},
    {"id": "zooriack", "name": "Zooriack", "domain": None},
    {"id": "mds", "name": "MDS", "domain": "mds.com.ve"},
    {"id": "dinamet", "name": "Dinamet", "domain": "dinamet.com.ve"},
    {"id": "herbaplant", "name": "Herbaplant", "domain": "herbaplant.com.ve"},
    {"id": "aless", "name": "Aless", "domain": "alesslaboratorios.com"},
    {"id": "lasante", "name": "Lasante", "domain": "lasante.com.ve"},
    {"id": "tiares", "name": "Tiares", "domain": "tiares.com.ve"},
]

# URLs directas conocidas (prioridad sobre scraping)
DIRECT_LOGOS: dict[str, str] = {
    "adium": "https://adiumpharma.com/wp-content/uploads/2023/03/logo-adium.svg",
    "calox": "https://calox.com/wp-content/uploads/2019/06/logo-calox.png",
    "eurofarma": "https://eurofarma.com.br/wp-content/themes/eurofarma/assets/img/logo-eurofarma.svg",
    "nirvalab": "https://nirvalab.net/wp-content/uploads/2024/08/logo-nirvalab.png",
    "clinicalar": "https://clinicalar.net/wp-content/uploads/2024/05/logo-clinicalar.png",
}


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def svg_wordmark(name: str) -> str:
    display = name.replace("&", "&amp;").replace("<", "&lt;")
    font_size = 22 if len(name) <= 12 else 18 if len(name) <= 18 else 15
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 96" role="img" aria-label="{display}">
  <rect width="280" height="96" rx="12" fill="#ffffff"/>
  <rect x="24" y="78" width="232" height="3" rx="1.5" fill="#C9A34E"/>
  <text x="140" y="52" text-anchor="middle" dominant-baseline="middle"
    font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="{font_size}" fill="#0A1F44">{display}</text>
</svg>"""


def find_logo_url(html: str, base_url: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        return urljoin(base_url, og["content"])

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        alt = (img.get("alt") or "").lower()
        cls = " ".join(img.get("class") or []).lower()
        src_lower = src.lower()
        if any(token in src_lower + alt + cls for token in ("logo", "brand", "marca")):
            return urljoin(base_url, src)

    for link in soup.find_all("link", rel=True):
        rel = link.get("rel")
        if isinstance(rel, str):
            rel = [rel]
        if any(r in ("apple-touch-icon", "icon", "shortcut icon") for r in rel):
            href = link.get("href")
            if href:
                return urljoin(base_url, href)
    return None


def save_bytes(content: bytes, dest: Path) -> None:
    dest.write_bytes(content)


def ext_from_url(url: str, content_type: str | None) -> str:
    path = urlparse(url).path.lower()
    for ext in (".svg", ".png", ".webp", ".jpg", ".jpeg"):
        if path.endswith(ext):
            return ext
    if content_type:
        if "svg" in content_type:
            return ".svg"
        if "png" in content_type:
            return ".png"
        if "webp" in content_type:
            return ".webp"
        if "jpeg" in content_type or "jpg" in content_type:
            return ".jpg"
    return ".png"


def try_download(url: str, dest_base: Path) -> str | None:
    try:
        resp = requests.get(url, timeout=15, headers=HEADERS)
        if resp.status_code != 200 or len(resp.content) < 400:
            return None
        ext = ext_from_url(url, resp.headers.get("Content-Type"))
        filename = dest_base.with_suffix(ext).name
        save_bytes(resp.content, OUT / filename)
        return filename
    except requests.RequestException:
        return None


def fetch_from_domain(domain: str, sponsor_id: str) -> str | None:
    for scheme in ("https", "http"):
        base = f"{scheme}://{domain}"
        try:
            page = requests.get(base, timeout=12, headers=HEADERS)
            if page.status_code >= 400:
                continue
            logo_url = find_logo_url(page.text, base)
            if logo_url:
                saved = try_download(logo_url, OUT / sponsor_id)
                if saved:
                    return saved
        except requests.RequestException:
            continue
    return None


def main() -> None:
    manifest: list[dict[str, str]] = []

    for sponsor in SPONSORS:
        sid = sponsor["id"]
        name = sponsor["name"]
        filename: str | None = None

        if sid in DIRECT_LOGOS:
            filename = try_download(DIRECT_LOGOS[sid], OUT / sid)

        if not filename and sponsor.get("domain"):
            filename = fetch_from_domain(sponsor["domain"], sid)

        if not filename:
            svg_path = OUT / f"{sid}.svg"
            svg_path.write_text(svg_wordmark(name), encoding="utf-8")
            filename = svg_path.name

        manifest.append({"id": sid, "name": name, "logo": f"/sponsors/{filename}"})
        print(f"{name}: {filename}")

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(manifest)} patrocinadores listos en {OUT}")


if __name__ == "__main__":
    main()
