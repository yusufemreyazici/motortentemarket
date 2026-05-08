"""
Batch product image processor for MotorTenteMarket site.
- Removes background using rembg (AI)
- Adds clean light-gray gradient background
- Resizes to 800x800 with centered padding
- Saves to images/products/{slug}/{n}.jpg
"""

import os
import sys
import re
import time
import io
from pathlib import Path
from PIL import Image, ImageDraw

try:
    from rembg import remove, new_session
except ImportError:
    print("rembg not installed. Run: pip install rembg pillow")
    sys.exit(1)

# ── Paths ────────────────────────────────────────────────────────────────────
SRC_DIR  = Path(r"C:\Users\Emre\Desktop\ürünler")
SITE_DIR = Path(r"C:\Workspace\Personal_Projects\Site")
OUT_DIR  = SITE_DIR / "images" / "products"

TARGET_SIZE = 800        # square output
BG_COLOR    = (247, 248, 250)   # site background color (#f7f8fa)
JPEG_QUALITY = 88

# ── Helpers ──────────────────────────────────────────────────────────────────
def slugify(name: str) -> str:
    """Convert folder name to URL-safe slug."""
    name = name.lower()
    replacements = {
        'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
        'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c',
    }
    for k, v in replacements.items():
        name = name.replace(k, v)
    name = re.sub(r'[^a-z0-9]+', '-', name).strip('-')
    return name


def make_bg(size: int) -> Image.Image:
    """Create a soft gradient background."""
    img = Image.new('RGB', (size, size), BG_COLOR)
    # subtle radial-ish vignette: lighter center
    draw = ImageDraw.Draw(img)
    center = size // 2
    # lighten center slightly
    for r in range(center, 0, -20):
        alpha = int(8 * (1 - r / center))
        draw.ellipse(
            [center - r, center - r, center + r, center + r],
            fill=(255, 255, 255, alpha) if False else None,
            outline=None,
        )
    return img


def compose(fg: Image.Image, size: int = TARGET_SIZE) -> Image.Image:
    """Place transparent-bg product on clean background, centered, with padding."""
    bg = Image.new('RGB', (size, size), BG_COLOR)

    # Fit product inside padded area (90% of canvas)
    pad = int(size * 0.08)
    max_w = size - 2 * pad
    max_h = size - 2 * pad

    fg.thumbnail((max_w, max_h), Image.LANCZOS)
    fw, fh = fg.size

    x = (size - fw) // 2
    y = (size - fh) // 2

    # Paste using alpha channel
    if fg.mode == 'RGBA':
        bg.paste(fg, (x, y), mask=fg.split()[3])
    else:
        bg.paste(fg, (x, y))

    return bg


def process_image(src_path: Path, dst_path: Path, session) -> bool:
    """Remove background and compose. Returns True on success."""
    try:
        with open(src_path, 'rb') as f:
            raw = f.read()

        # Remove background — outputs RGBA PNG bytes
        out_bytes = remove(raw, session=session)
        fg = Image.open(io.BytesIO(out_bytes)).convert('RGBA')

        result = compose(fg)
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        result.save(dst_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


# ── Main ─────────────────────────────────────────────────────────────────────
MODEL = "birefnet-general"   # isnet-general-use → birefnet-general (daha keskin)


def main():
    force = "--force" in sys.argv  # python process_images.py --force → hepsini yeniden işle

    if not SRC_DIR.exists():
        print(f"Source directory not found: {SRC_DIR}")
        sys.exit(1)

    folders = sorted([f for f in SRC_DIR.iterdir() if f.is_dir()])
    if not folders:
        print("No folders found.")
        sys.exit(1)

    print(f"Loading rembg model ({MODEL})...")
    session = new_session(MODEL)
    print(f"Model ready. force={force}\n")

    total_ok = total_skip = total_err = 0
    t_start = time.time()
    slug_map = {}

    for folder in folders:
        images = sorted(folder.glob('*.JPG')) + sorted(folder.glob('*.jpg')) + \
                 sorted(folder.glob('*.jpeg')) + sorted(folder.glob('*.PNG')) + \
                 sorted(folder.glob('*.png'))
        if not images:
            continue

        slug = slugify(folder.name)
        slug_map[folder.name] = slug
        out_folder = OUT_DIR / slug
        print(f"[{slug}] ({len(images)} photos)")

        for i, img_path in enumerate(images, 1):
            dst = out_folder / f"{i}.jpg"
            if dst.exists() and not force:
                print(f"  {i}/{len(images)} skip")
                total_skip += 1
                continue
            ok = process_image(img_path, dst, session)
            status = "OK" if ok else "FAIL"
            print(f"  {i}/{len(images)} {img_path.name} -> {status}", flush=True)
            if ok:
                total_ok += 1
            else:
                total_err += 1

    elapsed = time.time() - t_start
    print(f"\n{'='*50}")
    print(f"Done in {elapsed/60:.1f} min | OK: {total_ok} | Skipped: {total_skip} | Errors: {total_err}")
    print(f"Output: {OUT_DIR}")
    print("\nSlug mapping:")
    for name, slug in slug_map.items():
        print(f"  '{name}' -> '{slug}'")


if __name__ == '__main__':
    main()
