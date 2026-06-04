"""Descarga logos de patrocinadores o genera wordmarks SVG de respaldo."""
from __future__ import annotations

import json
import re
import shutil
import warnings
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "sponsors"
ASSETS = ROOT.parent.parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    )
}

SPONSORS = [
    {"id": "adium", "name": "Adium", "domain": "adium.com.ve"},
    {"id": "calox", "name": "Calox International", "domain": "calox.com"},
    {"id": "eurofarma", "name": "Eurofarma", "domain": "eurofarma.com.br"},
    {"id": "leti", "name": "Leti", "domain": "leti.com"},
    {"id": "urogastrol", "name": "Urogastrol", "domain": None},
    {"id": "cuevas", "name": "Cuevas", "domain": "cuevasmd.com.ve"},
    {"id": "bnh", "name": "BNH Medical", "domain": "bnhmedical.com"},
    {"id": "lasermed", "name": "Lasermed", "domain": "lasermed.com.ve"},
    {"id": "angelus", "name": "Angelus Health", "domain": "angelushealth.org"},
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
    {"id": "fc-pharma", "name": "FC Pharma Laboratorios", "domain": "fclaboratorios.com"},
    {"id": "hygea", "name": "Hygea", "domain": "hygea.com.ve"},
    {"id": "dalmed", "name": "Dalmed", "domain": "dalmed.com.ve"},
    {"id": "zoriak", "name": "ZORIAK", "domain": "zoriakpharma.com"},
    {"id": "mds", "name": "MDS", "domain": "mds.com.ve"},
    {"id": "dinamet", "name": "Dinamet", "domain": "dinamet.com.ve"},
    {"id": "herbaplant", "name": "Herbaplant", "domain": "herbaplant.com.ve"},
    {"id": "aless", "name": "Aless", "domain": "aless.com.ve"},
    {"id": "lasante", "name": "Lasante", "domain": "lasante.com.ve"},
    {"id": "tiares", "name": "Tiares", "domain": "tiares.com.ve"},
]

DIRECT_LOGOS: dict[str, str] = {
    "adium": "https://adium.com.ve/wp-content/uploads/sites/13/2026/01/logo-blanco.png",
    "calox": "https://calox.com/wp-content/uploads/2022/12/FIRMA-CORPORATIVA-HORZ.png",
    "nirvalab": "https://nirvalab.net/wp-content/uploads/2025/03/cropped-LogoRecurso-11.png",
    "clinicalar": "https://clinicalar.net/wp-content/uploads/2025/06/Mesa-de-trabajo-14-scaled.png",
    "herbaplant": "https://herbaplart.com.ve/img/app/logo_vertical.png",
    "herbaplant_fix": "https://herbaplant.com.ve/img/app/logo_vertical.png",
    "angelus": "https://www.angelushealth.org/wp-content/uploads/2024/04/logoANGELUS-original-300x124.png",
    "bnh": "https://bnhmedical.com/wp-content/uploads/2024/02/1a.BNH-Medical-2024-Color-S-FondoTransparente-.png",
    "dermaskin": "https://www.dermaskin.com.ve/wp-content/uploads/2020/09/logo-dermaskin.png",
    "lasermed": "https://lasermed.com.ve/wp-content/uploads/2020/09/logo-lasermed.png",
    "leti": "https://leti.com/images/127875/default.png",
    "quirutex": (
        "https://static.wixstatic.com/media/6d349f_51a354f36af2421da8c19a3cd6f85f01~mv2.png/"
        "v1/fill/w_621,h_117,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/"
        "6d349f_51a354f36af2421da8c19a3cd6f85f01~mv2.png"
    ),
    "tiares": (
        "https://static.wixstatic.com/media/f62650_62c9e0b8f47d4434909d6e7969398b94~mv2.png/"
        "v1/fill/w_326,h_76,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/"
        "f62650_62c9e0b8f47d4434909d6e7969398b94~mv2.png"
    ),
    "plusandex": "https://plusandex.com/wp-content/uploads/2025/09/Logo-plus-andex-rif-e1756868575371.png",
    "urolatam": "https://urolatam.com/cdn/shop/files/Uro_Logo.jpg?v=1756165163&width=600",
    "fc-pharma": (
        "https://fclaboratorios.com/wp-content/uploads/2022/05/"
        "cropped-cropped-Logo-FC-Pharma-Nuevo-Aprobado-1-300x98.png"
    ),
    "zoriak": "https://zoriakpharma.com/wp-content/uploads/2024/04/logo.svg",
    "gurve": "https://gurve.com/wp-content/uploads/2020/09/logo-gurve.png",
    "valmorca": "https://valmorca.com.ve/wp-content/uploads/2021/03/logo-valmorca.png",
}

# Corregir typo en herbaplant key
DIRECT_LOGOS["herbaplant"] = DIRECT_LOGOS.pop("herbaplant_fix")

LOCAL_OVERRIDES = {
    "urogastrol": OUT / "urogastrol.png",
    "fc-pharma": OUT / "fc-pharma.png",
    "zoriak": OUT / "zoriak.png",
}


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
    candidates: list[tuple[int, str]] = []

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if not src or src.startswith("data:"):
            continue
        url = urljoin(base_url, src)
        blob = f"{src} {(img.get('alt') or '')} {' '.join(img.get('class') or [])}".lower()
        score = 0
        if "logo" in blob:
            score += 3
        if "brand" in blob or "marca" in blob:
            score += 2
        candidates.append((score, url))

    candidates.sort(reverse=True)
    for score, url in candidates:
        if score > 0:
            return url

    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        return urljoin(base_url, og["content"])
    return None


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
    session = requests.Session()
    session.headers.update(HEADERS)
    session.verify = False
    try:
        resp = session.get(url, timeout=20)
        if resp.status_code != 200 or len(resp.content) < 800:
            return None
        ext = ext_from_url(url, resp.headers.get("Content-Type"))
        filename = dest_base.with_suffix(ext).name
        (OUT / filename).write_bytes(resp.content)
        return filename
    except requests.RequestException:
        return None


def fetch_from_domain(domain: str, sponsor_id: str) -> str | None:
    session = requests.Session()
    session.headers.update(HEADERS)
    session.verify = False
    for scheme in ("https", "http"):
        for host in (domain, f"www.{domain}"):
            base = f"{scheme}://{host}"
            try:
                page = session.get(base, timeout=12)
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


def resolve_logo(sponsor: dict) -> str:
    sid = sponsor["id"]
    name = sponsor["name"]

    if sid in LOCAL_OVERRIDES and LOCAL_OVERRIDES[sid].exists():
        return LOCAL_OVERRIDES[sid].name

    filename: str | None = None
    if sid in DIRECT_LOGOS:
        filename = try_download(DIRECT_LOGOS[sid], OUT / sid)

    if not filename and sponsor.get("domain"):
        filename = fetch_from_domain(sponsor["domain"], sid)

    if not filename:
        for existing in OUT.glob(f"{sid}.*"):
            if existing.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".svg"}:
                return existing.name

    if not filename:
        svg_path = OUT / f"{sid}.svg"
        svg_path.write_text(svg_wordmark(name), encoding="utf-8")
        filename = svg_path.name

    return filename


def main() -> None:
    manifest: list[dict[str, str]] = []

    for sponsor in SPONSORS:
        filename = resolve_logo(sponsor)
        manifest.append({"id": sponsor["id"], "name": sponsor["name"], "logo": f"/sponsors/{filename}"})
        print(f"{sponsor['name']}: {filename}")

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    official = sum(1 for m in manifest if re.search(r"\.(png|jpe?g|webp)$", m["logo"], re.I))
    print(f"\n{len(manifest)} patrocinadores · {official} logos oficiales · {OUT}")


if __name__ == "__main__":
    main()
