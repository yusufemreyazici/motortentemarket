"""
MotorTenteMarket — Gelismis Urun Fotografi Isleme
================================================
Kaynak klasordeki fotograflari:
  1. rembg birefnet-general ile arka plan kaldirir
  2. Parlaklik / kontrast / keskinlik / renk doygunlugu arttirir
  3. Alfa maskenin kenarlarini yumusatir (jagged edge giderir)
  4. Saf beyaz arka plan uzerine yerlestirir (Trendyol uyumlu)
  5. Hafif zemin golge ekler (profesyonel gorunum)
  6. 1000x1000 JPEG olarak kaydeder

Kullanim:
  python scripts/enhance_images.py            # yeni dosyalari isle
  python scripts/enhance_images.py --force    # hepsini yeniden isle
  python scripts/enhance_images.py --no-shadow  # golgesi olmasin
"""

import io, re, sys, time
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

try:
    from rembg import remove, new_session
except ImportError:
    print("HATA: pip install rembg pillow brotli")
    sys.exit(1)

# ── Ayarlar ──────────────────────────────────────────────────────────────────
SRC_DIR      = Path(r"C:\Users\Emre\Desktop\ürünler_web")
SITE_DIR     = Path(r"C:\Workspace\Personal_Projects\Site")
OUT_DIR      = SITE_DIR / "images" / "products"
MODEL        = "birefnet-general"
TARGET_SIZE  = 1000          # Trendyol min 1000x1000
PADDING_PCT  = 0.07          # urunun kanvasa orani: %86
JPEG_QUALITY = 90
BG_WHITE     = (255, 255, 255)

# Renk iyilestirme carpanlari
BRIGHTNESS = 1.10   # +%10 parlaklik
CONTRAST   = 1.12   # +%12 kontrast
SHARPNESS  = 1.30   # +%30 keskinlik
COLOR      = 1.12   # +%12 renk doygunlugu

# ── Slug ─────────────────────────────────────────────────────────────────────
def slugify(name: str) -> str:
    tr = {'ı':'i','ğ':'g','ü':'u','ş':'s','ö':'o','ç':'c',
          'İ':'i','Ğ':'g','Ü':'u','Ş':'s','Ö':'o','Ç':'c'}
    name = name.lower()
    for k, v in tr.items():
        name = name.replace(k, v)
    return re.sub(r'[^a-z0-9]+', '-', name).strip('-')

# ── Fotograf iyilestirme ──────────────────────────────────────────────────────
def enhance(img: Image.Image) -> Image.Image:
    """Arka plan kaldirmadan ONCE fotografa renk/isik gucu ver."""
    img = img.convert('RGB')
    img = ImageEnhance.Brightness(img).enhance(BRIGHTNESS)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    img = ImageEnhance.Color(img).enhance(COLOR)
    img = ImageEnhance.Sharpness(img).enhance(SHARPNESS)
    return img

def smooth_alpha(fg: Image.Image, radius: float = 1.5) -> Image.Image:
    """Alfa maskesinin keskin kenarlarini yumusatir."""
    if fg.mode != 'RGBA':
        return fg
    r, g, b, a = fg.split()
    a_smooth = a.filter(ImageFilter.GaussianBlur(radius))
    return Image.merge('RGBA', (r, g, b, a_smooth))

def add_shadow(canvas: Image.Image, fg: Image.Image,
               pos: tuple, offset=(0, 12), blur=18, opacity=55) -> None:
    """Kanvasa urun altina hafif zemin golge ekler."""
    if fg.mode != 'RGBA':
        return
    _, _, _, alpha = fg.split()
    shadow_layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    black = Image.new('RGBA', fg.size, (0, 0, 0, opacity))
    shadow_layer.paste(black, (pos[0] + offset[0], pos[1] + offset[1]), mask=alpha)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    # Beyaz kanvasa golgeli katmayi birlestir
    canvas_rgba = canvas.convert('RGBA')
    canvas_rgba = Image.alpha_composite(canvas_rgba, shadow_layer)
    canvas.paste(canvas_rgba.convert('RGB'))

def compose(fg: Image.Image, size: int = TARGET_SIZE,
            shadow: bool = True) -> Image.Image:
    """Urunu saf beyaz kanvasa ortalar, golgeli veya golgesiz."""
    pad = int(size * PADDING_PCT)
    max_dim = size - 2 * pad
    fg_copy = fg.copy()
    fg_copy.thumbnail((max_dim, max_dim), Image.LANCZOS)
    fw, fh = fg_copy.size
    x = (size - fw) // 2
    y = (size - fh) // 2

    canvas = Image.new('RGB', (size, size), BG_WHITE)

    if shadow and fg_copy.mode == 'RGBA':
        add_shadow(canvas, fg_copy, (x, y))

    if fg_copy.mode == 'RGBA':
        canvas.paste(fg_copy, (x, y), mask=fg_copy.split()[3])
    else:
        canvas.paste(fg_copy, (x, y))

    return canvas

# ── Ana isleme ────────────────────────────────────────────────────────────────
def process(src: Path, dst: Path, session, shadow: bool) -> bool:
    try:
        raw = src.read_bytes()
        # Once fotografi iyilestir
        img = Image.open(io.BytesIO(raw))
        img = enhance(img)
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=95)
        # Arkaplan kaldir
        fg_bytes = remove(buf.getvalue(), session=session)
        fg = Image.open(io.BytesIO(fg_bytes)).convert('RGBA')
        fg = smooth_alpha(fg)
        # Kanvasa yerlestir
        result = compose(fg, TARGET_SIZE, shadow=shadow)
        dst.parent.mkdir(parents=True, exist_ok=True)
        result.save(dst, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        return True
    except Exception as e:
        print(f"    HATA: {e}")
        return False

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    force     = '--force'     in sys.argv
    no_shadow = '--no-shadow' in sys.argv

    if not SRC_DIR.exists():
        print(f"Kaynak bulunamadi: {SRC_DIR}")
        sys.exit(1)

    folders = sorted(f for f in SRC_DIR.iterdir() if f.is_dir())
    print(f"Model yukleniyor ({MODEL})...")
    session = new_session(MODEL)
    print(f"Hazir. {len(folders)} klasor, force={force}, shadow={not no_shadow}\n")

    ok = skip = err = 0
    t0 = time.time()
    slug_map = {}

    for folder in folders:
        imgs = sorted(
            list(folder.glob('*.jpg')) + list(folder.glob('*.JPG')) +
            list(folder.glob('*.jpeg')) + list(folder.glob('*.png')) +
            list(folder.glob('*.PNG'))
        )
        if not imgs:
            continue

        slug = slugify(folder.name)
        slug_map[folder.name] = slug
        out = OUT_DIR / slug
        print(f"[{slug}]  {len(imgs)} fotograf")

        for i, src in enumerate(imgs, 1):
            dst = out / f"{i}.jpg"
            if dst.exists() and not force:
                print(f"  {i}/{len(imgs)} atla")
                skip += 1
                continue
            success = process(src, dst, session, shadow=not no_shadow)
            print(f"  {i}/{len(imgs)} {src.name} -> {'OK' if success else 'FAIL'}")
            ok += 1 if success else 0
            err += 0 if success else 1

    elapsed = time.time() - t0
    print(f"\n{'='*50}")
    print(f"Bitti: {elapsed/60:.1f} dk | OK:{ok} | Atlandi:{skip} | Hata:{err}")
    print(f"Cikti: {OUT_DIR}")
    if slug_map:
        print("\nSlug haritasi:")
        for name, slug in slug_map.items():
            print(f"  '{name}'  ->  '{slug}'")

if __name__ == '__main__':
    main()
