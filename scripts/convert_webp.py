"""
JPG/PNG → WebP batch converter
Runs from project root: python scripts/convert_webp.py
Skips files that already have a matching .webp sibling.
"""
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow bulunamadı. Kur: pip install Pillow")
    sys.exit(1)

IMAGES_DIR = Path(__file__).parent.parent / "images" / "products"
QUALITY    = 82   # WebP quality — good balance of size vs. visual fidelity
EXTENSIONS = {".jpg", ".jpeg", ".png"}

converted = skipped = errors = 0
saved_bytes = 0

for src in sorted(IMAGES_DIR.rglob("*")):
    if src.suffix.lower() not in EXTENSIONS:
        continue
    dst = src.with_suffix(".webp")
    if dst.exists():
        skipped += 1
        continue
    try:
        with Image.open(src) as img:
            rgb = img.convert("RGB") if img.mode in ("RGBA", "P") else img
            rgb.save(dst, "WEBP", quality=QUALITY, method=6)
        saved_bytes += src.stat().st_size - dst.stat().st_size
        converted += 1
        if converted % 100 == 0:
            print(f"  {converted} dönüştürüldü...")
    except Exception as e:
        print(f"  HATA: {src.name} — {e}")
        errors += 1

print(f"\n✓ Tamamlandı")
print(f"  Dönüştürülen : {converted}")
print(f"  Atlanılan    : {skipped} (zaten WebP vardı)")
print(f"  Hata         : {errors}")
print(f"  Kazanılan    : {saved_bytes/1024/1024:.1f} MB")
