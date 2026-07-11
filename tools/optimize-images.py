#!/usr/bin/env python3
"""Bilder fuer die Webseite aufbereiten.

Liest die Quellfotos aus assets/img/original und die Logos aus
assets/logo/original und erzeugt daraus web-optimierte Varianten in
frontend/public/img und frontend/public/logo: WebP als Hauptformat,
JPEG bzw. PNG als Fallback, EXIF entfernt, feste Groessen fuer Hero,
Galerie und Lightbox.

Nur noetig, wenn neue Fotos hinzukommen oder Groessen sich aendern.
Die fertige Webseite braucht dieses Skript nicht.

    python3 tools/optimize-images.py

Abhaengigkeit: Pillow (pip install Pillow).
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_IMG = ROOT / "assets" / "img" / "original"
SRC_LOGO = ROOT / "assets" / "logo" / "original"
PUBLIC = ROOT / "frontend" / "public"
OUT_IMG = PUBLIC / "img"
OUT_LOGO = PUBLIC / "logo"

# Galerie-Reihenfolge und Quelldateien. Slug steuert die Dateinamen,
# die Reihenfolge im HTML wird dort separat festgelegt.
GALLERY = [
    ("minibagger-wiese", "1744537280720_1.jpg"),
    ("leitungsgraben", "1759387530807_2.jpg"),
    ("planum-damm", "1759387633062_2.jpg"),
    ("bachlauf", "1744536844732.jpg"),
    ("garten-sichtschutz", "1759387359282_1.jpg"),
    ("baugrube-hauswand", "1759387713674_2.jpg"),
    ("uferplanum", "1744536959425.jpg"),
    ("minibagger-feldweg", "Bagger_2.jpg"),
]

HERO_DESKTOP_SRC = "1744537280720_1.jpg"
HERO_MOBILE_SRC = "Bagger_2.jpg"

manifest: list[tuple[str, str, int]] = []


def load(path: Path) -> Image.Image:
    """Bild oeffnen, Drehung aus EXIF anwenden, danach als RGB ohne Metadaten."""
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    return img.convert("RGB")


def record(path: Path, size: tuple[int, int]) -> None:
    kb = path.stat().st_size // 1024
    manifest.append((str(path.relative_to(ROOT)), f"{size[0]}x{size[1]}", kb))


def save_pair(img: Image.Image, stem: Path, webp_q: int, jpg_q: int) -> None:
    """Eine Bildgroesse als WebP plus JPEG-Fallback schreiben (ohne EXIF)."""
    webp = stem.with_suffix(".webp")
    jpg = stem.with_suffix(".jpg")
    img.save(webp, "WEBP", quality=webp_q, method=6)
    img.save(jpg, "JPEG", quality=jpg_q, optimize=True, progressive=True)
    record(webp, img.size)
    record(jpg, img.size)


def resized_to_width(img: Image.Image, width: int) -> Image.Image:
    if width >= img.width:
        return img.copy()
    height = round(img.height * width / img.width)
    return img.resize((width, height), Image.LANCZOS)


def contained(img: Image.Image, box: tuple[int, int]) -> Image.Image:
    """In eine Box einpassen, Seitenverhaeltnis bleibt erhalten."""
    out = img.copy()
    out.thumbnail(box, Image.LANCZOS)
    return out


def emblem_crop(img: Image.Image, bg: tuple[int, int, int]) -> Image.Image:
    """Das Bagger-Emblem aus dem Logo-Quadrat freistellen.

    Das Logo stapelt Emblem, Wortmarke und Kontaktzeilen. Diese Funktion
    nimmt nur den obersten Block: Sie sucht die erste groessere Luecke aus
    leeren Zeilen unter dem Emblem und schneidet dort ab, danach seitlich
    auf die Bounding-Box des Inhalts.
    """
    diff = ImageChops.difference(img, Image.new("RGB", img.size, bg)).convert("L")
    mask = diff.point(lambda p: 255 if p > 28 else 0)
    px = mask.load()
    width, height = mask.size
    step = 4
    noise_floor = width / step * 0.01

    def row_content(y: int) -> int:
        return sum(1 for x in range(0, width, step) if px[x, y])

    top = 0
    while top < height and row_content(top) <= noise_floor:
        top += 1

    gap_needed = int(height * 0.015)
    gap_run = 0
    bottom = top
    for y in range(top, height):
        if row_content(y) <= noise_floor:
            gap_run += 1
            if gap_run >= gap_needed and bottom > top:
                break
        else:
            gap_run = 0
            bottom = y

    band = mask.crop((0, top, width, min(bottom + 1, height)))
    horiz = band.getbbox()
    pad = round(width * 0.02)
    left = max((horiz[0] if horiz else 0) - pad, 0)
    right = min((horiz[2] if horiz else width) + pad, width)
    upper = max(top - pad, 0)
    lower = min(bottom + pad, height)
    return img.crop((left, upper, right, lower))


def resized_to_height(img: Image.Image, height: int) -> Image.Image:
    width = round(img.width * height / img.height)
    return img.resize((width, height), Image.LANCZOS)


def process_hero() -> None:
    # Desktop bleibt unter ~350 KB; die Wiese ist detailreich, daher 1800 px statt 2000.
    desktop = load(SRC_IMG / HERO_DESKTOP_SRC)
    for width in (1200, 1800):
        save_pair(resized_to_width(desktop, width), OUT_IMG / f"hero-desktop-{width}", 66, 76)
    mobile = load(SRC_IMG / HERO_MOBILE_SRC)
    for width in (640, 900):
        save_pair(resized_to_width(mobile, width), OUT_IMG / f"hero-mobile-{width}", 76, 82)


def process_gallery() -> None:
    for slug, filename in GALLERY:
        img = load(SRC_IMG / filename)
        save_pair(contained(img, (900, 900)), OUT_IMG / f"galerie-{slug}-thumb", 70, 78)
        save_pair(contained(img, (1600, 1600)), OUT_IMG / f"galerie-{slug}-full", 74, 80)


def save_logo(img: Image.Image, stem: Path, webp_q: int) -> None:
    """Logo-Variante als WebP plus PNG-Fallback (harte Kanten, Text)."""
    img.save(stem.with_suffix(".webp"), "WEBP", quality=webp_q, method=6)
    img.save(stem.with_suffix(".png"), "PNG", optimize=True)
    record(stem.with_suffix(".webp"), img.size)
    record(stem.with_suffix(".png"), img.size)


def process_logos() -> None:
    light = load(SRC_LOGO / "Logo_wei_2.png")
    dark = load(SRC_LOGO / "Logo_schwarz_2.png")
    light_bg = light.getpixel((4, 4))
    dark_bg = dark.getpixel((4, 4))
    print(f"Logo-Hintergrund hell:   rgb{light_bg}  #{light_bg[0]:02x}{light_bg[1]:02x}{light_bg[2]:02x}")
    print(f"Logo-Hintergrund dunkel: rgb{dark_bg}  #{dark_bg[0]:02x}{dark_bg[1]:02x}{dark_bg[2]:02x}")

    # Emblem (Bagger) freistellen: hell fuer den Header, dunkel fuer den Footer.
    # Der jeweilige Hintergrund wird im CSS exakt angeglichen, damit es nahtlos sitzt.
    for emblem, name in ((emblem_crop(light, light_bg), "light"), (emblem_crop(dark, dark_bg), "dark")):
        save_logo(resized_to_height(emblem, 144), OUT_LOGO / f"logo-emblem-{name}", 90)


def process_favicons() -> None:
    """Favicon und Apple-Touch-Icon aus dem dunklen Emblem erzeugen."""
    dark = load(SRC_LOGO / "Logo_schwarz_2.png")
    bg = dark.getpixel((4, 4))
    emblem = emblem_crop(dark, bg)
    side = round(max(emblem.size) * 1.3)
    square = Image.new("RGB", (side, side), bg)
    square.paste(emblem, ((side - emblem.width) // 2, (side - emblem.height) // 2))
    ico = square.resize((48, 48), Image.LANCZOS)
    ico.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    apple = square.resize((180, 180), Image.LANCZOS)
    apple.save(PUBLIC / "apple-touch-icon.png", optimize=True)
    record(PUBLIC / "favicon.ico", ico.size)
    record(PUBLIC / "apple-touch-icon.png", apple.size)


def main() -> None:
    process_logos()
    process_hero()
    process_gallery()
    process_favicons()
    print("\nErzeugte Dateien:")
    total = 0
    for name, dims, kb in sorted(manifest):
        total += kb
        print(f"  {name:48s} {dims:>11s} {kb:5d} KB")
    print(f"\n  Summe web-optimiert: {total} KB ({total / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
