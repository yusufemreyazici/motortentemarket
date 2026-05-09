# MotorTenteMarket — Profesyonel Performans Test Raporu
_Test Tarihi: 2026-05-09 | Tester: Claude Sonnet 4.6_

---

## ÖZET KART

| Metrik | Önce | Sonra | İyileşme |
|--------|------|-------|----------|
| Toplam görsel boyutu | 186.9 MB | 81.9 MB (WebP) | **-%56** |
| Ortalama görsel boyutu | 99 KB | ~42 KB | **-%57** |
| İlk 4 kart image loading | lazy (LCP gecikir) | eager | **LCP ↓** |
| Ana ürün görseli (detay) | eager, no priority | eager + fetchpriority=high | **LCP ↓** |
| Google Fonts ağırlık sayısı | 13 (Inter×7 + Jakarta×6) | 9 (Inter×6 + Jakarta×3) | **-%31** |
| CLS (kart görselleri) | 0 (aspect-ratio koruyor) | 0 (+ width/height attr) | ✅ |
| Müşteri yorumları | Yok | 6 yorum + schema.org | ✅ |

---

## 1. CRITICAL RENDER PATH ANALİZİ

### Render-Blocking Kaynaklar (sırayla yükleniyor)

```
HEAD'de:
1. [BLOCKING] Google Fonts CSS    → ~120-300ms (external, network)
2. [BLOCKING] Font Awesome CSS    → ~80-180ms  (cdnjs CDN)
3. [BLOCKING] style.css           → ~10-30ms   (local, 84KB)
   Toplam tahmini blokaj: ~210-510ms

BODY sonunda (non-blocking):
4. products-data.js  38KB  → non-blocking ✅
5. main.js / urunler.js / urun-detay.js → non-blocking ✅
```

### Render-Blocking Analiz

**Google Fonts:**
- `preconnect` var ✅ — bu DNS lookup'ı öne alıyor
- `display=swap` var ✅ — font yüklenene kadar sistem fontu gösteriliyor
- Yüklenen ağırlıklar (düzeltme sonrası): Inter 400,500,600,700,800,900 + Jakarta Sans 600,700,800
- Tahmini font dosyası sayısı: ~9 (her ağırlık ayrı dosya, WOFF2)
- Tahmini toplam font boyutu: ~150-200KB (gzipped ~45-60KB)

**Font Awesome 6.5.1 (full):**
- 47 ikon kullanılıyor, ~2000+ ikon tanımlı
- all.min.css: ~30KB
- Webfont dosyaları: solid + brands = ~120KB woff2
- Kullanım verimliliği: **%2.35** — çok israf
- **Öneri:** Self-hosted subset veya [iconify.design](https://iconify.design/) ile sadece kullanılan ikonları al

**style.css:**
- 84KB, minify edilmemiş
- Gzip ile ~18-20KB'a iner (sunucu gzip açıksa)
- **Öneri:** Vercel/Netlify otomatik gzip yapıyor, problem değil canlıya alınca

---

## 2. GÖRSEL PERFORMANS TESTİ

### Genel Durum

| Parametre | Değer |
|-----------|-------|
| Toplam görsel (JPG) | 1.937 adet |
| Toplam JPG boyutu | 186.9 MB |
| Ortalama JPG boyutu | 99 KB |
| En büyük klasör | pony-x-kurulum/ (16 MB, 141 görsel) |
| Toplam WebP boyutu | 81.9 MB |
| Ortalama WebP boyutu | ~42 KB |
| WebP tasarruf | **105 MB (%56)** |

### Sayfa Başı Bandwidth Etkisi (tahmini)

**Ürünler sayfası (12 kart, ilk yükleme):**
- Önce: 12 × 99KB = ~1.2 MB
- Sonra: 12 × 42KB = ~504 KB
- Tasarruf: **~700 KB per page load**

**Ürün detay sayfası (20 thumbnail + 1 main):**
- Önce: 21 × 99KB = ~2.1 MB (tümü lazy değil)
- Sonra: 21 × 42KB = ~882 KB
- Tasarruf: **~1.2 MB per page load**

### Lazy Loading Durumu

| Bileşen | Loading Stratejisi | Doğru mu? |
|---------|-------------------|-----------|
| Ürün kartları (ilk 4) | `eager` | ✅ LCP için doğru |
| Ürün kartları (4+) | `lazy` | ✅ |
| Ürün detay ana görsel | `eager` + `fetchpriority=high` | ✅ LCP optimize |
| Ürün detay thumbnail'ler | `lazy` | ✅ |
| Google Maps iframe | `loading="lazy"` | ✅ |
| Liste görünümü kartları | `lazy` | ✅ |

### CLS (Cumulative Layout Shift) Analizi

- `.pcard-img` → `aspect-ratio:1/1` var ✅ — kart konteyneri sabit boyutlu
- `<img>` elementlerinde `width="800" height="800"` eklendi ✅ — browser boyut önceden biliyor
- **Beklenen CLS: 0.00** ✅

---

## 3. JAVASCRIPT PERFORMANS TESTİ

### Dosya Boyutları

| Dosya | Boyut | Yükleme Yeri | Sorun |
|-------|-------|-------------|-------|
| products-data.js | 38 KB | Body sonu | ✅ Non-blocking |
| urunler.js | 16 KB | Body sonu | ✅ |
| urun-detay.js | 17 KB | Body sonu | ✅ |
| main.js | 4 KB | Body sonu | ✅ |
| Fuse.js (CDN) | ~30 KB | Body sonu (urunler.html) | ✅ |

### Parse & Execution Süresi (tahmini, modern cihaz)

- products-data.js: 79 ürün nesnesi + image array'ler = **~1-2ms** parse
- filterProductsLocally: 79 item üzerinde O(n) = **< 1ms** execution
- Sayfalama: Slice(0,12) = **anlık**

### Kritik Sorun: Tüm Ürünler Upfront Yükleniyor

- 79 ürünün tamamı `products-data.js` içinde static JS olarak yükleniyor
- Büyük image array'leri string memory oluşturuyor:
  - `pony-x-kurulum`: 141 adet string × ~45 karakter = ~6.3KB sadece bir ürün için
  - `pony-x-resim`: 66 string, `apec-kurulum`: 66 string
- Toplam image path string'leri: ~tahminen 500KB string hafıza
- **Kullanıcı etkisi:** Minimal (modern tarayıcı), ancak eski/düşük RAM telefonda hissedilebilir
- **Öneri (backend gelinceye kadar):** Kritik değil, backend gelince API handle eder

---

## 4. SAYFA BAZLI TEST SONUÇLARI

### index.html

| Test | Sonuç | Not |
|------|-------|-----|
| HTML boyutu | 24 KB | İçerisinde 6 yorum + LocalBusiness schema |
| Render-blocking CSS | 3 adet | Google Fonts, FA, style.css |
| İlk görünür içerik | Hero metin başlığı | CSS-only, hızlı |
| LCP adayı | Hero h1 metni | CSS metin, instant |
| Hero arka planı | CSS gradient (görsel yok) | ✅ LCP'yi etkilemez |
| Ürün kartları (öne çıkan) | JS-render, API fallback | İlk 4 eager |
| CLS riski | Düşük | Aspect-ratio korunuyor |
| Schema markup | LocalBusiness JSON-LD ✅ + AggregateRating ✅ | |

### urunler.html

| Test | Sonuç | Not |
|------|-------|-----|
| HTML boyutu | 18 KB | Ürünler JS ile render |
| Fuse.js CDN | +30 KB | Body sonunda, non-blocking |
| API → fallback süresi | ~50-200ms (fetch timeout) | Sonra anlık local filter |
| İlk ürün kartları (LCP) | loading="eager" (ilk 4) ✅ | |
| Filtre performansı | < 1ms (79 ürün, O(n)) | ✅ |
| Fuzzy search | Fuse.js aktif, threshold 0.38 | ✅ |
| Pagination | Client-side, anlık | ✅ |
| Sidebar açılma animasyonu | CSS transition | ✅ |

### urun-detay.html

| Test | Sonuç | Not |
|------|-------|-----|
| HTML boyutu | 20 KB | |
| Ana görsel | eager + fetchpriority=high ✅ | LCP optimize |
| Thumbnail şerit | loading=lazy ✅ | |
| Galeri navigation | DOM-based, < 1ms | ✅ |
| Swipe (mobile) | passive touchstart ✅ | Scroll performansını bozmaz |
| Lightbox | CSS fixed overlay + keyboard nav | ✅ |
| JSON-LD Product schema | Dinamik inject ✅ | |
| Benzer ürünler | Aynı kategoriden 4 ürün | ✅ |
| Paylaş butonu | navigator.share + clipboard fallback | ✅ |
| Geri dön | sessionStorage referrer restore | ✅ |

---

## 5. MOBİL PERFORMANS TESTİ

### Touch & Interaction

| Test | Sonuç |
|------|-------|
| Hamburger drawer animasyonu | CSS transform, GPU accelerated ✅ |
| Swipe gallery | touchstart passive ✅ |
| Buton boyutları | Minimum 44×44px (Apple HIG) — çoğu uyumlu |
| Announcement bar | 3 saniye döngü, tek öğe gösteriliyor ✅ |
| Footer accordion | CSS transition ✅ |
| Mobil arama | Ayrı overlay arama kutusu ✅ |

### Viewport & Layout Shift

- Meta viewport: `width=device-width, initial-scale=1.0` ✅
- Grid responsive: `repeat(auto-fill, minmax(220px, 1fr))` — mobile 1-2 sütun ✅
- `.pcard-img aspect-ratio:1/1` — hiç CLS yok ✅

---

## 6. SEO & CRAWLER PERFORMANSI

| Kontrol | Durum |
|---------|-------|
| robots.txt | ✅ |
| sitemap.xml (79 ürün) | ✅ |
| index.html meta title | ✅ |
| index.html meta description | ✅ |
| Open Graph (tüm sayfalar) | ✅ |
| Twitter Card (tüm sayfalar) | ✅ |
| LocalBusiness JSON-LD | ✅ |
| Product JSON-LD (dinamik) | ✅ |
| AggregateRating schema | ✅ |
| BreadcrumbList | ✅ (urun-detay) |
| Image alt text | ✅ (açıklayıcı) |
| Canonical URL | ❌ Eksik — her sayfaya `<link rel="canonical">` ekle |
| `lang="tr"` | ✅ |
| `hreflang` | N/A (tek dil) |

---

## 7. KALAN KRİTİK SORUNLAR

### 🔴 Yüksek Öncelik

**1. Font Awesome full pack yükleniyor — %97.65 israf**
- 47 ikon için ~150KB webfont + 30KB CSS yükleniyor
- Çözüm A (hızlı): Cloudflare varyantı ile sadece `solid` + `brands` subset — ~80KB tasarruf
- Çözüm B (ideal): [Iconify](https://iconify.design/) — sadece kullanılan ikonları inline SVG olarak serve eder, 0KB font dosyası

**2. Canonical tag eksik**
- Duplicate content riski yok ama Google best practice
- Her HTML sayfasına ekle: `<link rel="canonical" href="https://motortentemarket.com/sayfa.html">`

### 🟡 Orta Öncelik

**3. Google Fonts render-blocking**
- Gerçek düzeltme: Font dosyalarını self-host et (next-font-downloader ile)
- Vercel'de deploy edilince bu sorun azalır (edge cache, aynı region)
- Kısa vadeli: `media="print" onload="this.media='all'"` trick ile async yükleme

**4. style.css minify edilmemiş**
- 84KB → tahmini 45KB (minify) → ~18KB gzip
- Vercel otomatik gzip yapıyor ✅ — ama minify yapmıyor
- Düzeltme: `cssnano` ile build step ekle

**5. Script `defer` attribute eksik**
- Body sonundaki scriptlere `defer` eklemek teorik olarak fayda sağlamaz (zaten DOM parse bitti)
- Ama `type="module"` veya `defer` ile browser daha iyi optimize edebilir

### 🟢 Küçük

**6. `preload` ile kritik kaynakları öne çek**
```html
<!-- Her sayfanın <head>'ine eklenebilir -->
<link rel="preload" href="css/style.css" as="style">
<link rel="preload" href="js/products-data.js" as="script">
```

**7. WebP fallback admin paneli**
- Admin'de ürün fotoğrafı yükleme alanı var (placeholder)
- Backend gelince upload ederken WebP de üretmeli

---

## 8. TAHMİNİ LIGHTHOUSE SKORLARI

> Not: Gerçek Lighthouse testi için site canlıya alındıktan sonra çalıştır.
> Aşağıdakiler statik kod analizine dayalı tahminlerdir.

### Önceki Durum (tahmin)
| Metrik | Tahmini Skor |
|--------|-------------|
| Performance | 52-60 |
| Accessibility | 78-82 |
| Best Practices | 85 |
| SEO | 72-78 |

### Bu Oturum Sonrası (tahmin)
| Metrik | Tahmini Skor | Değişim |
|--------|-------------|---------|
| Performance | 68-76 | ↑ +16 |
| Accessibility | 85-90 | ↑ +7 |
| Best Practices | 88 | ↑ +3 |
| SEO | 88-92 | ↑ +14 |

### Performance Skoru Düşmeye Devam Edecek Nedeni
Font Awesome full pack + Google Fonts render-blocking en büyük engel olmaya devam ediyor.
Font Awesome subset veya Iconify geçişi yapılırsa Performance 80+ beklenir.

---

## 9. ÖNCELİK SIRASI — SIRADAKI ADIMLAR

| # | Aksiyon | Etki | Süre |
|---|---------|------|------|
| 1 | Canonical tag tüm sayfalara ekle | SEO | 30 dk |
| 2 | Font Awesome → sadece solid+brands subset | Performance +8 | 2 saat |
| 3 | Google Fonts async yükleme (`media="print"` trick) | Performance +5 | 30 dk |
| 4 | GA4 Measurement ID alıp ekle | Analytics | 1 saat |
| 5 | Canlıya al (Vercel) + gerçek Lighthouse çalıştır | Doğrulama | — |
| 6 | Backend: AuthController → ProductsController | Admin | Sprint |
