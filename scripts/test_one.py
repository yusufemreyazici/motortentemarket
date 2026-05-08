"""Quick single-image test with different models."""
import sys
import io
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

src = Path(r"C:\Users\Emre\Desktop\urünler\iki tekerlekli\CISH7677.JPG")
# Try the actual path with Turkish chars
src = Path(r"C:\Users\Emre\Desktop") / "ürünler" / "ıkı tekerleklı" / "CISH7677.JPG"

BG_COLOR = (247, 248, 250)

def compose(fg, size=800):
    bg = Image.new('RGB', (size, size), BG_COLOR)
    pad = int(size * 0.08)
    max_w = size - 2 * pad
    max_h = size - 2 * pad
    fg.thumbnail((max_w, max_h), Image.LANCZOS)
    fw, fh = fg.size
    x = (size - fw) // 2
    y = (size - fh) // 2
    if fg.mode == 'RGBA':
        bg.paste(fg, (x, y), mask=fg.split()[3])
    else:
        bg.paste(fg, (x, y))
    return bg

for model in ["isnet-general-use", "birefnet-general"]:
    print(f"Testing model: {model}")
    try:
        session = new_session(model)
        with open(src, 'rb') as f:
            raw = f.read()
        out = remove(raw, session=session)
        fg = Image.open(io.BytesIO(out)).convert('RGBA')
        result = compose(fg)
        dst = Path(r"C:\Workspace\Personal_Projects\Site\images\products\_test") / f"test_{model.replace('-','_')}.jpg"
        dst.parent.mkdir(parents=True, exist_ok=True)
        result.save(dst, 'JPEG', quality=88)
        print(f"  Saved: {dst}")
    except Exception as e:
        print(f"  ERROR: {e}")
