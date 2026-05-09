# MotorTenteMarket — Site CLAUDE.md

Statik HTML/CSS/JS sitesi. Sunucu: `npx serve` (proje kökünden).

---

## Teknik Stack

- Saf HTML + CSS + Vanilla JS (framework yok)
- Font Awesome ikonlar — **self-hosted subset** (`css/fa-subset/fa-subset.css`)
- Google Fonts: Inter + Plus Jakarta Sans (optimize edilmiş weight'ler)
- `js/products-data.js` — tüm ürün verisi + shared header/footer JS
- `js/urunler.js` — ürünler sayfası filtre/render + Fuse.js fuzzy search
- `js/urun-detay.js` — ürün detay sayfası

---

## Yapılanlar (Tamamlandı)

### UI & Tasarım
- [x] Ürün kartları Trendyol/Hepsiburada stili grid tasarımına dönüştürüldü (`.pcard`, `.pcard-img`, `.pcard-body`)
- [x] Liste görünümü (`.pcard-list`) — ayrı panel görünümü kaldırıldı, birleşik kart
- [x] Mobil hamburger menü → sağ taraftan açılan drawer (`.h2-nav`, `.drawer-*`)
- [x] Footer accordion (Kategoriler/Kurumsal/Yardım) mobilde tıklayınca açılıyor
- [x] Announcement bar mobilde tek öğe döngüsüne çevrildi (setInterval 3s)
- [x] Social media ikonları (Instagram, Facebook) görünür hale getirildi
- [x] hakkimizda.html — mobilde sağdaki dekoratif mavi gradient kutu gizlendi

### Resim İşleme
- [x] `scripts/process_images.py` yazıldı — arka plan kaldırma + 800x800 kompozit
- [x] Model `isnet-general-use` → `birefnet-general` yükseltildi (daha keskin kesim)
- [x] **57 klasör / 1215+ resim işlendi**, `images/products/{slug}/{n}.jpg` olarak kaydedildi

### Ürün Verisi & Fotoğraflar
- [x] Excel'den 79 ürün + gerçek fiyatlar `products-data.js`'e işlendi
- [x] `ürünler_web` klasöründeki yeni fotoğraflar mevcut slug'lara eklendi (sıralı numaralandırma)
- [x] İnternetten (Trendyol CDN, arora.com.tr, motolux.com.tr vb.) 26 yeni slug klasörü oluşturuldu
- [x] **70/79 ürüne fotoğraf bağlandı** — kalan 9'un internette görseli yok
- [x] `_imgs(slug, count)` helper ile tüm ürün kartları ve detay sayfası gerçek görsel gösteriyor
- [x] Ürün detay sayfası: tıklanabilir thumbnail şeridi + büyük ana görsel

### SEO Paketi
- [x] Tüm sayfalara `<title>` + `<meta description>` eklendi
- [x] `sitemap.xml` — 79 ürün + tüm statik sayfalar (Google Search Console'a submit edilmeli)
- [x] `robots.txt` eklendi
- [x] Open Graph + Twitter Card tag'leri tüm sayfalara eklendi
- [x] `<link rel="canonical">` tüm sayfalara eklendi (duplicate content koruması)
- [x] JSON-LD şemaları: `LocalBusiness`, `Product` (dinamik), `AggregateRating`, `BreadcrumbList`, `Review`
- [x] Image `alt` text'leri açıklayıcı hale getirildi

### Performans Optimizasyonları
- [x] **WebP dönüşümü** — 1937 JPG → WebP, 186 MB → 82 MB (**-%56**), `scripts/convert_webp.py`
- [x] `<picture>` + `<source type="image/webp">` — tüm ürün kartları ve detay sayfası
- [x] İlk 4 ürün kartı `loading="eager"` (LCP optimizasyonu), geri kalanlar `lazy`
- [x] Ana ürün görseli `fetchpriority="high"` (detay sayfası LCP)
- [x] Google Fonts weight optimizasyonu — Inter:300 ve Jakarta italic kaldırıldı (13 → 9 istek)
- [x] **Font Awesome self-hosted subset** — CDN 175 KB → lokal 12.8 KB (**-%93**)
  - `scripts/fa_subset.py` ile üretildi (fonttools + brotli)
  - `css/fa-subset/fa-subset.css` + iki woff2 dosyası
  - Solid: 78 ikon / 7.7 KB | Brands: 3 ikon / 1.0 KB

### Kullanıcı Deneyimi
- [x] Lightbox — tam ekran galeri, klavye navigasyonu (← →), swipe (mobil)
- [x] Fuzzy search — Fuse.js ile yazım hatası toleranslı arama (`arorra` → Arora)
- [x] Benzer ürünler bölümü — ürün detay altında aynı kategoriden 4 ürün
- [x] Ürün paylaş butonu — `navigator.share` API + clipboard fallback
- [x] Breadcrumb navigasyon — ürün detayda + schema.org `BreadcrumbList`
- [x] "Geri dön" butonu — `sessionStorage` ile filtre state'i korunuyor
- [x] Müşteri yorumları — index.html'de 6 yorum + `AggregateRating` schema
- [x] Google Maps iframe — `iletisim.html`'de embed harita
- [x] Print CSS — `@media print` ile ürün sayfası yazdırma görünümü optimize edildi
- [x] Favoriler sistemi **İPTAL EDİLDİ** — asla yapılmayacak

---

## Fotoğrafı Olmayan 9 Ürün

Bunların fotoğrafı internette bulunamadı (410 silindi / marka bilinmiyor):

| ID | Ürün | Sebep |
|----|------|-------|
| 15 | Altemur 3000 | Marka platformlarda yok |
| 23 | JPN Avatar VIP | Trendyol'dan silindi (410) |
| 46 | Lukdy Leksas | Marka bulunamadı |
| 49 | Limme Triporter | Marka bulunamadı |
| 51 | Kral B05 | Kral'ın ürün gamında yok |
| 53 | JPN Avatar | Trendyol'dan silindi (410) |
| 62 | Motolux Fayton 7100 | Üretim dışı, görsel yok |
| 77 | Leksas Humay | Leksas kabin değil araç üretiyor |
| 78 | JPN Tiger 3 | Hiçbir platformda yok |

Çözüm: Ya kendi fotoğrafını çek ya da model adını doğrula.

---

## Yapılacaklar — Öncelik Sırasıyla

### 🔴 YÜKSEK ÖNCELİK

- [ ] **Google Analytics GA4** — Measurement ID al (`G-XXXXXXXX`), `gtag.js` ekle
  - Hangi ürünler bakılıyor, hangi şehir, mobil/masaüstü oranı
  - Ücretsiz, küçük esnaf için kritik veri — 30 dakika iş

- [ ] **Google Search Console** — `sitemap.xml`'i submit et, indexleme başlasın

- [ ] **Canlıya al (Vercel)** → gerçek Lighthouse testi çalıştır

### 🟡 ORTA ÖNCELİK

- [ ] **Ürün bazında gerçek açıklamalar**
  - Şu an tüm ürünler aynı `_kasDesc` / `_elDesc` kullanıyor
  - Top 10 ürün için özgün açıklama — hem SEO hem güven

- [ ] **Kurulum videosu embed (ürün detay)**
  - `products-data.js`'e `videoId` alanı ekle, YouTube embed
  - Müşteri kurulumu görmeden almaya çekiniyor

- [ ] **Sipariş formu (`siparis-ver.html`)**
  - Formspree/Netlify Forms ile e-posta al
  - Ya da ürün seçimli WhatsApp mesajı oluştur

### 🟢 UZUN VADELİ

- [ ] **Backend (.NET)** — AuthController, ProductsController, AdminProductsController
  - Admin paneli şu an localStorage auth + static data kullanıyor
  - API hazır olduğunda `products-data.js` fallback otomatik devre dışı kalır

---

## Teknik Notlar

### `products-data.js` Ekleme Yapısı
```js
// Fotoğraflı ürün
{ id:X, name:'...', brand:'...', category:'kasal-motor-kabinleri',
  categoryLabel:'Kasalı Motor Kabini', price:XXXXX,
  description:_kasDesc, features:_kasFeatures, specs:_kasSpecs,
  images:_imgs('slug-adi', ADET) }

// Birden fazla klasörden fotoğraf
images:[..._imgs('resim-slug', N),..._imgs('kurulum-slug', M)]
```

### Yeni Ürün Fotoğrafı Ekleme
1. `images/products/{slug}/` klasörü oluştur
2. Fotoğrafları `1.jpg`, `2.jpg`, ... olarak kaydet
3. `products-data.js`'de ilgili ürüne `images:_imgs('slug', adet)` ekle

### Font Awesome Subset Yenileme
Siteye yeni ikon eklenirse:
1. `scripts/fa_subset.py` içindeki `USED_SOLID` listesine ikon adını ekle
2. `python scripts/fa_subset.py` çalıştır — CSS + woff2 otomatik yenilenir
3. Script kendi temp dosyalarını temizler; `css/fa-subset/` içinde sadece 3 dosya kalmalı

### Trendyol CDN URL Formatı
`https://cdn.dsmcdn.com/ty{XXXX}/prod/.../{n}_org_zoom.jpg`
→ URL'deki `mnresize/W/H/` önekini kaldır → tam çözünürlük

### Yeni Klasörler (İnternetten İndirilen — Son Oturum)
`sfm-ihlara-sf-400` (12), `volta-vms-neo` (2), `arora-felix-pro` (2),
`arora-ruzgar-new` (6), `arora-mini-cargo` (3), `arora-derya` (3),
`arora-xlt-48-derya` (2), `motolux-fayton-500x` (2), `motolux-fayton-fx08` (1),
`zlin-truva` (6), `zlin-mutluluk` (3), `motolux-fx23` (2), `volta-vms` (1),
`falcon-fulya-9000` (3), `mondial-e-mon-capry` (4), `kral-ankaa` (7),
`kral-kr-306-tren` (1), `kral-vesta-5000` (2), `sfm-magneta-e-1800` (6),
`skyjet-ecocar` (5), `skyjet-ecocar-15` (2), `apachy-doru` (1), `apachi-q5` (1),
`volta-vm4` (1), `kuba-eco-pikap` (1), `rks-xigma` (1), `falcon-family-8000` (3),
`stmax-smart-3000` (2), `musatti-masilya` (1), `akeso-yagiz` (1),
`yuki-yk-16-ilgaz` (3), `arora-pro-plus-2024` (4), `kral-saray` (3)

---

## CSS Sınıf Sistemi (Özet)

| Sınıf | Kullanım |
|-------|----------|
| `.pcard-grid` | Grid görünüm container (4 sütun) |
| `.pcard-list` | Liste görünüm container |
| `.pcard` | Tek ürün kartı |
| `.pcard-img` | Kare resim alanı (aspect-ratio 1/1) |
| `.pcard-body` | İsim, fiyat, buton alanı |
| `.h2-nav` | Mobil nav drawer (sağdan açılır) |
| `.drawer-*` | Drawer iç elementleri |
| `.f2-col-toggle` | Footer accordion başlığı |
| `.f2-col-links` | Footer accordion içeriği |
