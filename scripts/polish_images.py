"""
Mevcut islenmis urun fotograflarini gelistirir (rembg gerektirmez, hizli).

Yaptiklarimiz:
  1. Gri arka plani saf beyaza cevir  (#f7f8fa → #ffffff)
  2. Parlaklik / kontrast / keskinlik / renk doygunlugu artir
  3. 1000x1000'e yuksel (LANCZOS kaliteli)
  4. Hafif drop shadow ekle

Kullanim:
  python scripts/polish_images.py              # images/products/ altindaki tum JPG'leri isle
  python scripts/polish_images.py --force      # zaten islenmisleri de yeniden isle
  python scripts/polish_images.py --preview    # sadece 3 ornek fotograf isle (test)
"""

import sys, time
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

SITE_DIR     = Path(r"C:\Workspace\Personal_Projects\Site")
IMG_DIR      = SITE_DIR / "images" / "products"
OUT_SIZE     = 1000
JPEG_Q       = 91

# Guclendirme carpanlari
BRIGHTNESS   = 1.08
CONTRAST     = 1.12
SHARPNESS    = 1.35
COLOR        = 1.10

# Arka plan rengi (process_images.py'de BG_COLOR = (247,248,250))
BG_ORIG      = np.array([247, 248, 250], dtype=float)
BG_TOLERANCE = 14   # JPEG siki baskisini tolere et


def bg_to_white(arr: np.ndarray) -> np.ndarray:
    """Kose piksellerini referans alarak arka plani tespit et ve beyaza cevir."""
    # Goruntunun dort koesinden + kenarlarin ortasindan ornek al
    samples = np.array([
        arr[0, 0],           arr[0, -1],
        arr[-1, 0],          arr[-1, -1],
        arr[0, arr.shape[1]//2],  arr[-1, arr.shape[1]//2],
        arr[arr.shape[0]//2, 0],  arr[arr.shape[0]//2, -1],
    ], dtype=float)
    bg_ref = np.median(samples, axis=0)

    # Eger kose rengi cok beyaz degilse arka plan yok demektir
    if np.all(bg_ref > 235):
        diff = np.abs(arr.astype(float) - bg_ref)
        mask = np.all(diff < BG_TOLERANCE, axis=2)
        arr = arr.copy()
        arr[mask] = [255, 255, 255]
    return arr


def enhance(img: Image.Image) -> Image.Image:
    img = ImageEnhance.Brightness(img).enhance(BRIGHTNESS)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    img = ImageEnhance.Color(img).enhance(COLOR)
    img = ImageEnhance.Sharpness(img).enhance(SHARPNESS)
    return img


def add_shadow(canvas: Image.Image, product_mask: np.ndarray) -> Image.Image:
    """Urun sinirini kullanarak hafif altta golge olustur."""
    shadow_layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow_layer)

    # Urun maskesini PIL imajina cevir
    mask_img = Image.fromarray((product_mask * 40).astype(np.uint8), mode='L')  # 40/255 opaklık
    # Golgeli siyah katmani urun pozisyonuna +10px asagida yerlestir
    shadow_layer.paste(Image.new('RGBA', canvas.size, (0, 0, 0, 40)),
                       mask=mask_img.transform(canvas.size, Image.AFFINE,
                                               (1, 0, 0, 0, 1, -10)))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(12))
    result = Image.alpha_composite(canvas.convert('RGBA'), shadow_layer)
    return result.convert('RGB')


def process(src: Path) -> Image.Image:
    img = Image.open(src).convert('RGB')
    arr = np.array(img)

    # 1. Gri arka plani beyaza cevir
    arr = bg_to_white(arr)

    # 2. Urun maskesi: arka plan olmayan pikseller
    is_bg = np.all(arr >= 250, axis=2)  # beyaz arka plan
    product_mask = (~is_bg).astype(np.uint8) * 255

    # 3. PIL iyilestirme
    img = enhance(Image.fromarray(arr))

    # 4. 1000x1000 kanvasa yerlestir (ürünü ortalayarak)
    canvas = Image.new('RGB', (OUT_SIZE, OUT_SIZE), (255, 255, 255))
    pad = int(OUT_SIZE * 0.07)
    max_dim = OUT_SIZE - 2 * pad
    img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    x = (OUT_SIZE - img.width) // 2
    y = (OUT_SIZE - img.height) // 2

    # 5. Drop shadow (urun maskesinden)
    pm_resized = Image.fromarray(product_mask).resize(img.size, Image.LANCZOS)
    pm_arr = np.array(pm_resized)

    shadow = Image.new('RGBA', (OUT_SIZE, OUT_SIZE), (0, 0, 0, 0))
    pm_placed = Image.new('L', (OUT_SIZE, OUT_SIZE), 0)
    pm_placed.paste(pm_resized, (x, y + 10))  # +10px asagi
    shadow.paste(Image.new('RGBA', (OUT_SIZE, OUT_SIZE), (0, 0, 0, 45)),
                 mask=pm_placed)
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))

    canvas_rgba = canvas.convert('RGBA')
    canvas_rgba = Image.alpha_composite(canvas_rgba, shadow)
    canvas_rgba.paste(img.convert('RGBA'), (x, y))
    return canvas_rgba.convert('RGB')


def main():
    force   = '--force'   in sys.argv
    preview = '--preview' in sys.argv

    if not IMG_DIR.exists():
        print(f"Klasor bulunamadi: {IMG_DIR}")
        sys.exit(1)

    jpgs = sorted(IMG_DIR.rglob('*.jpg'))
    # Gecici test klasorunu atla
    jpgs = [p for p in jpgs if '_test' not in str(p)]

    if preview:
        jpgs = jpgs[:3]
        print(f"PREVIEW modu: sadece {len(jpgs)} fotograf isleniyor")

    print(f"Toplam: {len(jpgs)} fotograf | force={force}")
    ok = skip = err = 0
    t0 = time.time()

    for jpg in jpgs:
        try:
            # Boyutu kontrol et — zaten 1000x1000 ise atla
            with Image.open(jpg) as probe:
                w, h = probe.size
            if w >= 1000 and h >= 1000 and not force:
                skip += 1
                continue

            result = process(jpg)
            result.save(jpg, 'JPEG', quality=JPEG_Q, optimize=True)
            ok += 1
            if ok % 50 == 0:
                pct = ok / len(jpgs) * 100
                print(f"  {ok}/{len(jpgs)} ({pct:.0f}%) tamamlandi...")
        except Exception as e:
            print(f"  HATA {jpg.name}: {e}")
            err += 1

    elapsed = time.time() - t0
    print(f"\nBitti: {elapsed:.0f}s | Guncellendi:{ok} | Atlandi:{skip} | Hata:{err}")


if __name__ == '__main__':
    main()
