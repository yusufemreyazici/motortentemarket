# MotorTenteMarket — Site CLAUDE.md

Statik HTML/CSS/JS sitesi. Sunucu: `npx serve` (proje kökünden).

---

## Teknik Stack

- Saf HTML + CSS + Vanilla JS (framework yok)
- Font Awesome ikonlar (CDN)
- Google Fonts: Inter
- `js/products-data.js` — tüm ürün verisi + shared header/footer JS
- `js/urunler.js` — ürünler sayfası filtre/render
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

### Ürün Verisi & Fotoğraflar (Son Oturum)
- [x] Excel'den 79 ürün + gerçek fiyatlar `products-data.js`'e işlendi
- [x] `ürünler_web` klasöründeki yeni fotoğraflar mevcut slug'lara eklendi (sıralı numaralandırma)
- [x] İnternetten (Trendyol CDN, arora.com.tr, motolux.com.tr vb.) 26 yeni slug klasörü oluşturuldu
- [x] **70/79 ürüne fotoğraf bağlandı** — kalan 9'un internette görseli yok
- [x] `_imgs(slug, count)` helper ile tüm ürün kartları ve detay sayfası gerçek görsel gösteriyor
- [x] Ürün detay sayfası: tıklanabilir thumbnail şeridi + büyük ana görsel

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

### 🔴 YÜKSEK ÖNCELİK — SEO (Site şu an Google'da neredeyse görünmez)

Müşteriler "elektrikli motor kabini" veya "arora rüzgar kabin" diye aradığında bu site çıkmıyor.
Rakip az, niche pazar — doğru SEO ile ilk sayfaya girmek mümkün.

- [ ] **Her sayfaya `<title>` ve `<meta description>` ekle**
  - Örnek: `<title>Arora Rüzgar Pro Kasalı Motor Kabini | Motor Tente Market</title>`
  - Ürün detay sayfasında JS ile dinamik olarak set edilmeli (ürün adıyla)
  - Kategori sayfası: "79 Model Elektrikli Motor Kabini — Motor Tente Market"

- [ ] **JSON-LD Product schema (ürün detay sayfası)**
  - Google'da fiyat + görsel doğrudan arama sonucunda çıkabilir (rich snippet)
  - `urun-detay.js` içinde `<script type="application/ld+json">` inject et
  - Alanlar: `name`, `image`, `description`, `brand`, `offers.price`, `offers.priceCurrency`

- [ ] **`sitemap.xml` oluştur**
  - Tüm 79 ürün için: `urun-detay.html?id=X`
  - Kategori sayfaları, statik sayfalar
  - Google Search Console'a submit et

- [ ] **`robots.txt` ekle** (şu an yok)

- [ ] **Open Graph + Twitter Card tag'leri**
  - Facebook/Instagram'da paylaşınca ürün görseli + adı çıksın
  - `og:title`, `og:description`, `og:image` (ilk ürün görseli), `og:url`

- [ ] **Image `alt` text'leri düzelt**
  - Şu an `alt="Arora Rüzgar Pro"` var ama daha açıklayıcı olmalı
  - "Arora Rüzgar Pro 3 tekerlekli elektrikli motor kasalı kabin"

---

### 🟡 ORTA ÖNCELİK — Kullanıcı Deneyimi

- [ ] **Lightbox / Tam ekran galeri (ürün detay)**
  - Şu an büyük resme tıklayınca hiçbir şey olmuyor
  - Basit: CSS `position:fixed` overlay + klavye navigasyonu (← →)
  - Ya da [GLightbox](https://biati-digital.github.io/glightbox/) CDN (4KB, bağımlılıksız)

- [ ] **Favoriler (localStorage)**
  - Ürün kartlarına kalp ikonu ekle — tıklayınca localStorage'a kaydet
  - `favoriler.html` zaten var ama muhtemelen boş — localStorage'dan çekerek ürünleri listele
  - Badge: header'da favori sayısı (sepet ikonu gibi)

- [ ] **Benzer Ürünler bölümü (ürün detay altı)**
  - Aynı kategoriden rastgele 4 ürün — "Bunları da inceleyebilirsiniz"
  - `urun-detay.js` içinde tek fonksiyon, mevcut ürün hariç aynı `category` filtrele

- [ ] **Ürün paylaş butonu**
  - "Linki kopyala" + "WhatsApp'ta paylaş" — `navigator.share` API veya fallback
  - Müşteri beğendiği ürünü ailesine/arkadaşına gönderiyor

- [ ] **Breadcrumb navigasyon**
  - Ürün detayda: Ana Sayfa > Kasalı Kabinler > Arora Rüzgar Pro
  - Hem kullanıcı deneyimi hem SEO (schema.org BreadcrumbList)

- [ ] **Ürün detayda "Geri dön" butonu**
  - Şu an tarayıcı geri tuşu çalışıyor ama filtre state'i kaybolabiliyor
  - Referrer URL'yi sakla, "← Ürünlere Dön" diye geri link ver

---

### 🟢 UZUN VADELİ — Büyüme & İçerik

- [ ] **Google Analytics GA4**
  - Hangi ürünler bakılıyor? Hangi şehirden geliyorlar? Mobil mi masaüstü mü?
  - Kurulum: `gtag.js` CDN + tek satır ID — 30 dakika iş
  - Ücretsiz, küçük esnaf için kritik veri

- [ ] **Ürün bazında gerçek açıklamalar**
  - Şu an tüm ürünler aynı `_kasDesc` / `_elDesc` kullanıyor
  - En azından top 10 ürün için özgün açıklama yaz
  - Bu hem SEO'ya hem güvene katkı sağlar

- [ ] **Müşteri yorumları (statik)**
  - 5-6 gerçek müşteri yorumu — hakkimizda.html veya ana sayfa
  - Fotoğraflı olursa daha inandırıcı
  - Schema.org `Review` markup ile Google'da yıldız gösterir

- [ ] **Kurulum videosu embed (ürün detay)**
  - YouTube'da kurulum videosu varsa ürün sayfasına göm
  - `products-data.js`'e `videoId` alanı eklenebilir
  - Müşteri kurulumu görmeden almaya çekiniyor — video bu engeli kaldırır

- [ ] **Fuzzy arama (Fuse.js)**
  - Şu an "arora" yazarsan bulur ama "arorra" yazarsan bulamaz
  - [Fuse.js](https://fusejs.io/) CDN ile ekle — 5KB, sıfır bağımlılık
  - Türkçe karakter normalize edilmeli (ü→u, ş→s vb.)

- [ ] **Google My Business harita embed**
  - `iletisim.html`'ye Google Maps iframe
  - İşletme adı + adres + çalışma saatleri belirgin olmalı

- [ ] **WebP dönüşümü + srcset**
  - Mevcut JPG'leri WebP'ye çeviren script (`scripts/convert_webp.py`)
  - `<img srcset="foto.webp, foto.jpg">` ile tarayıcı WebP desteklemeyenlere JPG verir
  - Sayfa yüklenme hızı %30-50 iyileşir → Google sıralama etkisi

- [ ] **Print CSS (ürün sayfası)**
  - Müşteri ürün sayfasını yazdırıp aile üyelerine gösteriyor
  - `@media print` ile header/footer gizle, fiyat ve WA numarası belirgin kalsın

- [ ] **Sipariş formu iyileştirme (`siparis-ver.html`)**
  - Mevcut form nereye gidiyor? Formspree/Netlify Forms ile e-posta al
  - Veya doğrudan ürün seçimli WhatsApp mesajı oluştur

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
