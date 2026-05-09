"""
Font Awesome 6.5.1 Subset Generator
Sadece sitede kullanilan ikonlari iceren minimal CSS + webfont uretir.
Calistir: python scripts/fa_subset.py
"""
import re, sys, subprocess, urllib.request
from pathlib import Path

OUT_DIR  = Path(__file__).parent.parent / "css" / "fa-subset"
FONT_DIR = OUT_DIR / "webfonts"
FA_VER   = "6.5.1"
BASE_CDN = f"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{FA_VER}"

USED_SOLID = [
    "anchor","angles-down","arrow-left","arrow-right","arrows-left-right",
    "barcode","bars","bolt","box","box-open","broom","car","car-side",
    "check","check-circle","chevron-down","chevron-left","chevron-right",
    "chevron-up","circle","circle-check","circle-dot","circle-down",
    "circle-exclamation","circle-info","circle-question","clock","comments",
    "credit-card","door-open","envelope","exclamation-triangle","expand","eye",
    "fire","gem","grip-lines","headset","industry","info-circle","lightbulb",
    "link","list","lock","magnifying-glass","map-marker-alt","medal",
    "motorcycle","pen-ruler","phone","plus","qrcode","question-circle",
    "ruler-combined","scissors","search","share-alt","share-nodes",
    "shield-alt","shield-halved","shipping-fast","shopping-bag","shopping-cart",
    "sliders-h","spinner","star","star-half-alt","store","sun","tag",
    "th","th-large","times","times-circle","tint","tint-slash","tools",
    "triangle-exclamation","truck","truck-pickup","umbrella","undo","wrench",
    # FA5 compat isimleri (HTML'de bu isimle kullaniliyor)
    "play","circle-play","cut",
    "arrows-alt-h","arrows-alt-v","play-circle","hands-helping",
]
USED_BRANDS = ["whatsapp","instagram","facebook-f"]

# FA5/FA6 codepoints for icons not reliably parsed from minified CSS.
# Values are stable across FA5/FA6 (same glyph, sometimes different name).
CODEPOINT_FALLBACK = {
    'angles-down':          0xf103,
    'arrows-left-right':    0xf07e,
    'car':                  0xf1b9,
    'circle-check':         0xf058,  # = check-circle
    'circle-down':          0xf358,
    'clock':                0xf017,
    'credit-card':          0xf09d,
    'info-circle':          0xf05a,  # = circle-info
    'link':                 0xf0c1,
    'list':                 0xf03a,
    'map-marker-alt':       0xf3c5,  # = location-dot
    'plus':                 0xf067,
    'question-circle':      0xf059,  # = circle-question
    'scissors':             0xf0c4,  # = cut
    'search':               0xf002,  # = magnifying-glass
    'share-nodes':          0xf1e0,  # = share-alt
    'shield-halved':        0xf3ed,  # = shield-alt
    'shopping-bag':         0xf290,
    'shopping-cart':        0xf07a,
    'th':                   0xf00a,
    'th-large':             0xf009,
    'times':                0xf00d,  # = xmark
    'times-circle':         0xf057,  # = circle-xmark
    'tint':                 0xf043,  # = droplet
    'tint-slash':           0xf5c7,  # = droplet-slash
    'tools':                0xf7d9,  # = screwdriver-wrench
    'triangle-exclamation': 0xf071,  # = exclamation-triangle
    'undo':                 0xf0e2,  # = rotate-left
    # FA5 isimleri HTML'de kullanildiginda bu aliaslar lazim
    'arrows-alt-h':         0xf07e,  # = arrows-left-right
    'arrows-alt-v':         0xf338,  # = arrows-up-down
    'play-circle':          0xf144,  # = circle-play
    'hands-helping':        0xf4c4,  # = handshake-angle
}

def dl(url, dest):
    Path(dest).parent.mkdir(parents=True, exist_ok=True)
    print(f"  Indiriliyor: {Path(dest).name} ...", end=" ", flush=True)
    urllib.request.urlretrieve(url, dest)
    print(f"{Path(dest).stat().st_size//1024} KB")
    return Path(dest)

def parse_css(css_text):
    """icon-adi -> unicode int esleme"""
    mapping = {}
    # FA6 minified: tek veya coklu selector, iki format:
    # .fa-bars:before{content:"\f0c9"}  (tek selector)
    # .fa-bars:before,.fa-navicon:before{content:"\f0c9"}  (coklu selector)
    for m in re.finditer(r'\.fa-([a-z0-9-]+):before(?:,[^{]*)?\{content:"\\([0-9a-fA-F]+)"', css_text):
        if m.group(1) not in mapping:
            mapping[m.group(1)] = int(m.group(2), 16)
    # Bosluklu format: .fa-xxx::before { content: "\fXXX"; }
    for m in re.finditer(r'\.fa-([a-z0-9-]+)::?before(?:,[^{]*)?\s*\{[^}]*content:\s*"\\([0-9a-fA-F]+)"', css_text):
        if m.group(1) not in mapping:
            mapping[m.group(1)] = int(m.group(2), 16)
    return mapping

def subset_font(src, unicodes, dest):
    if not unicodes:
        print(f"  Atlandi (bos): {Path(dest).name}")
        return False
    from fontTools import subset as ft_subset
    u_str = ",".join(f"U+{u:04X}" for u in sorted(unicodes))
    opts = ft_subset.Options()
    opts.flavor = "woff2"
    opts.hinting = False
    opts.desubroutinize = True
    opts.layout_features = []
    font = ft_subset.load_font(str(src), opts)
    subsetter = ft_subset.Subsetter(options=opts)
    subsetter.populate(unicodes=ft_subset.parse_unicodes(u_str))
    subsetter.subset(font)
    ft_subset.save_font(font, str(dest), opts)
    font.close()
    sz = Path(dest).stat().st_size
    print(f"  {Path(dest).name}: {sz//1024} KB  ({sz} bytes)")
    return sz > 100  # 100 byte altiysa basarisiz say

def build_css(s_map, b_map):
    out = []
    out.append('@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:block;src:url("webfonts/fa-solid-subset.woff2") format("woff2")}')
    out.append('.fas,.fa-solid{font-family:"Font Awesome 6 Free";font-weight:900;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;display:inline-block}')
    out.append('.fa-spin{animation:fa-spin 1s infinite linear}@keyframes fa-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}')
    out.append('.fa-xs{font-size:.75em}.fa-sm{font-size:.875em}.fa-lg{font-size:1.25em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}')
    out.append('@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:block;src:url("webfonts/fa-brands-subset.woff2") format("woff2")}')
    out.append('.fab,.fa-brands{font-family:"Font Awesome 6 Brands";font-weight:400;font-style:normal;font-variant:normal;text-rendering:auto;-webkit-font-smoothing:antialiased;display:inline-block}')
    for name in sorted(USED_SOLID):
        if name in s_map:
            out.append(f'.fa-{name}:before{{content:"\\{s_map[name]:04x}"}}')
    for name in sorted(USED_BRANDS):
        if name in b_map:
            out.append(f'.fa-{name}:before{{content:"\\{b_map[name]:04x}"}}')
    return "\n".join(out)

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    FONT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        from fontTools import subset as _
        print(f"fonttools hazir: {sys.executable}\n")
    except ImportError:
        print("HATA: fonttools bulunamadi. Kur: pip install fonttools brotli")
        sys.exit(1)

    def dl_cached(url, dest):
        """Zaten varsa indirme, sadece boyutu goster."""
        p = Path(dest)
        if p.exists() and p.stat().st_size > 1000:
            print(f"  Kullaniliyor (cache): {p.name}  {p.stat().st_size//1024} KB")
            return p
        return dl(url, dest)

    print("[1/4] FA all.min.css indiriliyor (ikon esleme icin)...")
    all_css = dl_cached(f"{BASE_CDN}/css/all.min.css", OUT_DIR / "_all.min.css")
    css_text = all_css.read_text(encoding="utf-8")

    print("\n[2/4] Unicode eslemeleri cikartiliyor...")
    solid_map  = parse_css(css_text)
    # Regex'in kaciracagi ikonlar icin hardcoded fallback uygula
    applied = []
    for name, cp in CODEPOINT_FALLBACK.items():
        if name not in solid_map:
            solid_map[name] = cp
            applied.append(name)
    if applied:
        print(f"  Fallback uygulandi: {applied}")
    brands_map = solid_map.copy()
    brands_css = dl_cached(f"{BASE_CDN}/css/brands.min.css", OUT_DIR / "_brands.min.css")
    brands_map.update(parse_css(brands_css.read_text(encoding="utf-8")))

    missing_s = [n for n in USED_SOLID  if n not in solid_map]
    missing_b = [n for n in USED_BRANDS if n not in brands_map]
    s_unicodes = {solid_map[n]  for n in USED_SOLID  if n in solid_map}
    b_unicodes = {brands_map[n] for n in USED_BRANDS if n in brands_map}

    print(f"  Solid : {len(s_unicodes)} codepoint bulundu  (eksik: {missing_s if missing_s else 'yok'})")
    print(f"  Brands: {len(b_unicodes)} codepoint bulundu  (eksik: {missing_b if missing_b else 'yok'})")

    print("\n[3/4] Webfontlar indiriliyor ve subset yapiliyor...")
    solid_src  = dl_cached(f"{BASE_CDN}/webfonts/fa-solid-900.woff2",  FONT_DIR / "_fa-solid-900.woff2")
    brands_src = dl_cached(f"{BASE_CDN}/webfonts/fa-brands-400.woff2", FONT_DIR / "_fa-brands-400.woff2")

    solid_ok  = subset_font(solid_src,  s_unicodes, FONT_DIR / "fa-solid-subset.woff2")
    brands_ok = subset_font(brands_src, b_unicodes, FONT_DIR / "fa-brands-subset.woff2")

    # Gecici full fontlari sil
    solid_src.unlink(missing_ok=True)
    brands_src.unlink(missing_ok=True)
    (OUT_DIR / "_all.min.css").unlink(missing_ok=True)
    (OUT_DIR / "_brands.min.css").unlink(missing_ok=True)

    print("\n[4/4] Minimal CSS uretiliyor...")
    css = build_css(solid_map, brands_map)
    css_path = OUT_DIR / "fa-subset.css"
    css_path.write_text(css, encoding="utf-8")

    print("\n=== SONUC ===")
    total = 0
    for f in [FONT_DIR/"fa-solid-subset.woff2", FONT_DIR/"fa-brands-subset.woff2", css_path]:
        if f.exists():
            sz = f.stat().st_size
            total += sz
            print(f"  {f.name:35s}: {sz/1024:.1f} KB  ({sz} bytes)")
    print(f"  {'TOPLAM':35s}: {total/1024:.1f} KB")
    print(f"  Full FA CDN (tahmin)              : ~175 KB")
    print(f"  Tasarruf                          : ~{max(0, 175 - total//1024)} KB")

if __name__ == "__main__":
    main()
