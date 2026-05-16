// ===== API BASE — dev: static server :3000, backend :5275 | prod: same origin =====
// Backend yokken boş string bırak → fetch atlanır, direkt local data kullanılır
const API_BASE = '';

// ===== PRODUCT CACHE =====
window._productCache = {};

// ===== UTILITIES =====
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
}

function normalizeTR(s) {
    return (s || '').toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

// ===== SHARED HEADER & SCROLL =====
function initHeader() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    // Drawer içeriğini yalnızca mobilde oluştur
    if (nav && window.innerWidth <= 768) {
        nav.innerHTML = `
        <div class="drawer-head">
            <div class="drawer-brand">
                <svg viewBox="0 0 76 76" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                    <defs><linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e4d8c"/><stop offset="100%" stop-color="#1a56db"/></linearGradient></defs>
                    <path d="M38 3 L67 12 V36 C67 54 54 67 38 73 C22 67 9 54 9 36 V12 Z" fill="url(#dg1)"/>
                    <path d="M22 21 H54 L52 25 H24 Z" fill="#fbbf24"/>
                    <g transform="translate(38,42)" fill="#fff"><path d="M-15 11 V-7 C-15 -10 -13 -12 -10 -12 H-7 L-2 -3 L0 -8 L2 -3 L7 -12 H10 C13 -12 15 -10 15 -7 V11 H10 V-5 L5 4 H-5 L-10 -5 V11 Z"/></g>
                </svg>
                <span>Motor Tente Market</span>
            </div>
            <button class="drawer-close" id="drawerClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="drawer-body">
            <div class="drawer-section-label">Kategoriler</div>
            <a href="urunler.html" class="drawer-link"><i class="fas fa-th-large"></i><span>Tüm Ürünler</span></a>
            <a href="urunler.html?kategori=2-tekerlekli" class="drawer-link"><i class="fas fa-motorcycle"></i><span>2 Tekerlekli</span></a>
            <a href="urunler.html?kategori=3-tekerlekli" class="drawer-link"><i class="fas fa-car-side"></i><span>3 Tekerlekli</span></a>
            <a href="urunler.html?kategori=4-tekerlekli" class="drawer-link"><i class="fas fa-car"></i><span>4 Tekerlekli</span></a>

            <div class="drawer-divider"></div>
            <div class="drawer-section-label">Hızlı Erişim</div>
            <a href="siparis-ver.html" class="drawer-link drawer-link--highlight"><i class="fas fa-pen-ruler"></i><span>Özel Sipariş Ver</span></a>
            <a href="hakkimizda.html" class="drawer-link"><i class="fas fa-store"></i><span>Hakkımızda</span></a>
            <a href="iletisim.html" class="drawer-link"><i class="fas fa-phone"></i><span>İletişim</span></a>

            <div class="drawer-divider"></div>
            <div class="drawer-section-label">Yardım</div>
            <a href="kargo-teslimat.html" class="drawer-link"><i class="fas fa-truck"></i><span>Kargo &amp; Teslimat</span></a>
            <a href="iade-degisim.html" class="drawer-link"><i class="fas fa-undo"></i><span>İade &amp; Değişim</span></a>
            <a href="garanti.html" class="drawer-link"><i class="fas fa-shield-halved"></i><span>Garanti</span></a>
            <a href="sss.html" class="drawer-link"><i class="fas fa-circle-question"></i><span>Sık Sorulan Sorular</span></a>
            <a href="kurulum-rehberi.html" class="drawer-link"><i class="fas fa-wrench"></i><span>Kurulum Rehberi</span></a>
        </div>
        <div class="drawer-foot">
            <a href="https://wa.me/905327748927?text=Merhaba,%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" class="drawer-wa"><i class="fab fa-whatsapp"></i> WhatsApp ile Yaz</a>
            <p class="drawer-copy">© 2026 Motor Tente Market<br>Büyükada, İstanbul · EST. 1974</p>
        </div>`;
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'navOverlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;backdrop-filter:blur(2px);transition:opacity .32s;';
    document.body.appendChild(overlay);

    function openMenu() {
        btn?.classList.add('active');
        nav?.classList.add('active');
        overlay.style.display = 'block';
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        btn?.classList.remove('active');
        nav?.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 320);
        document.body.style.overflow = '';
    }

    btn?.addEventListener('click', () => nav?.classList.contains('active') ? closeMenu() : openMenu());
    overlay.addEventListener('click', closeMenu);
    document.getElementById('drawerClose')?.addEventListener('click', closeMenu);
    document.querySelectorAll('#nav .drawer-link').forEach(link => link.addEventListener('click', closeMenu));

    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const srch = document.querySelector('.h2-search input');
    if (srch && srch.id !== 'headerSearch') {
        srch.addEventListener('keydown', e => {
            if (e.key === 'Enter' && srch.value.trim())
                window.location.href = 'urunler.html?ara=' + encodeURIComponent(srch.value.trim());
        });
    }

    // Footer accordion (mobil)
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.f2-grid > div:not(.f2-about)').forEach(col => {
            const h4 = col.querySelector('h4');
            if (!h4) return;
            const links = col.querySelectorAll('a');
            if (!links.length) return;

            const wrap = document.createElement('div');
            wrap.className = 'f2-col-links';
            links.forEach(a => wrap.appendChild(a));

            h4.classList.add('f2-col-toggle');
            const chevron = document.createElement('i');
            chevron.className = 'fas fa-chevron-down f2-chevron';
            h4.appendChild(chevron);

            col.appendChild(wrap);

            h4.addEventListener('click', () => {
                const open = wrap.classList.toggle('open');
                h4.classList.toggle('open', open);
            });
        });
    }

    // Duyuru barı mobil rotasyonu
    if (window.innerWidth <= 640) {
        const items = document.querySelectorAll('.announce-item');
        if (items.length > 1) {
            let idx = 0;
            items[0].classList.add('ann-active');
            setInterval(() => {
                items[idx].classList.remove('ann-active');
                idx = (idx + 1) % items.length;
                items[idx].classList.add('ann-active');
            }, 3000);
        }
    }

    // Favori ikonu header'a inject et
    const actions = document.querySelector('.h2-actions');
    // Mobil arama toggle
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (searchToggleBtn && mobileSearchBar) {
        searchToggleBtn.addEventListener('click', () => {
            const open = mobileSearchBar.style.display === 'block';
            mobileSearchBar.style.display = open ? 'none' : 'block';
            if (!open) mobileSearchInput?.focus();
        });
        mobileSearchInput?.addEventListener('keydown', e => {
            if (e.key === 'Enter' && mobileSearchInput.value.trim())
                window.location.href = 'urunler.html?ara=' + encodeURIComponent(mobileSearchInput.value.trim());
        });
    }

    // Site settings — load from API and apply to DOM (fire-and-forget)
    initSiteSettings();
}

// ===== SITE SETTINGS — fetch from API, update DOM elements =====
async function initSiteSettings() {
    try {
        const resp = await fetch(`${API_BASE}/api/settings`);
        if (!resp.ok) return;
        const s = await resp.json();
        window._siteSettings = s;
        applySettingsToDOM(s);
    } catch {}
}

function applySettingsToDOM(s) {
    if (!s) return;

    // Social links in footer (.f2-soc)
    document.querySelectorAll('.f2-soc a').forEach(a => {
        const h = a.getAttribute('href') || '';
        if (s.instagram && h.includes('instagram.com')) a.href = s.instagram;
        else if (s.facebook && h.includes('facebook.com')) a.href = s.facebook;
        else if (s.youTube && h.includes('youtube.com')) a.href = s.youTube;
        else if (s.twitter && (h.includes('twitter.com') || h.includes('x.com'))) a.href = s.twitter;
    });

    // All WhatsApp links everywhere in the page
    if (s.whatsApp) {
        const num = s.whatsApp.replace(/\D/g, '');
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            const old = a.getAttribute('href');
            const qs = old.includes('?') ? '?' + old.split('?').slice(1).join('?') : '';
            a.href = `https://wa.me/${num}${qs}`;
        });
    }
}

// ===== PRODUCT CARD HTML =====
function _pcardIcon(p) {
    const c = p.category || '';
    if (c === '4-tekerlekli') return 'car';
    return 'car-side';
}
function _pcardBadge(p) {
    if (p.badge === 'Çok Satan' || p.badge === 'En Popüler') return ['bestseller', 'ÇOK SATAN'];
    if (p.isNew) return ['new', 'YENİ'];
    if (p.oldPrice) return ['sale', 'İNDİRİM'];
    return ['', ''];
}

/* Grid card — Trendyol/Hepsiburada tarzı */
function productCardHTML(p, eager) {
    window._productCache[p.id] = p;
    const icon = _pcardIcon(p);
    const [badgeCls, badgeTxt] = _pcardBadge(p);
    const waNum = window._siteSettings?.whatsApp ? window._siteSettings.whatsApp.replace(/\D/g,'') : '905327748927';
    const wa = encodeURIComponent('Merhaba, "' + p.name + '" ürünü hakkında bilgi almak istiyorum.\nÜrün Kodu: MTM-' + String(p.id).padStart(4,'0') + '\nFiyat: ' + formatPrice(p.price));
    const altText = p.name + ' ' + (p.categoryLabel || '') + ' elektrikli motor kabini';
    const webp   = p.images?.[0]?.replace(/\.(jpg|jpeg|png)$/i, '.webp') || '';
    const loadAttr = eager ? 'eager' : 'lazy';
    const imgEl = (p.images && p.images.length)
        ? '<picture>'
          +   '<source srcset="' + webp + '" type="image/webp">'
          +   '<img src="' + p.images[0] + '" alt="' + altText + '" loading="' + loadAttr + '" width="800" height="800" onerror="this.closest(\'picture\').style.display=\'none\';this.closest(\'picture\').nextElementSibling.style.display=\'\'">'
          + '</picture>'
          + '<i class="fas fa-' + icon + '" style="display:none"></i>'
        : '<i class="fas fa-' + icon + '"></i>';
    return '<div class="pcard">'
        + '<a class="pcard-link" href="urun-detay.html?id=' + p.id + '" aria-label="' + p.name + '"></a>'
        + '<div class="pcard-img">'
        +   imgEl
        +   (badgeCls ? '<span class="pcard-badge ' + badgeCls + '">' + badgeTxt + '</span>' : '')
        + '</div>'
        + '<div class="pcard-body">'
        +   '<div class="pcard-brand">' + p.brand + '</div>'
        +   '<div class="pcard-name">' + p.name + '</div>'
        +   '<div class="pcard-price">'
        +     (p.oldPrice ? '<small>' + formatPrice(p.oldPrice) + '</small>' : '')
        +     formatPrice(p.price)
        +   '</div>'
        +   '<a href="https://wa.me/' + waNum + '?text=' + wa + '" class="pcard-wa" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Sipariş Ver</a>'
        + '</div>'
        + '</div>';
}

/* Row card — list view */
function productRowHTML(p) {
    window._productCache[p.id] = p;
    const icon = _pcardIcon(p);
    const [badgeCls, badgeTxt] = _pcardBadge(p);
    const waNum = window._siteSettings?.whatsApp ? window._siteSettings.whatsApp.replace(/\D/g,'') : '905327748927';
    const wa = encodeURIComponent('Merhaba, "' + p.name + '" ürünü hakkında bilgi almak istiyorum.\nÜrün Kodu: MTM-' + String(p.id).padStart(4,'0') + '\nFiyat: ' + formatPrice(p.price));
    const altText = p.name + ' ' + (p.categoryLabel || '') + ' elektrikli motor kabini';
    const webpR  = p.images?.[0]?.replace(/\.(jpg|jpeg|png)$/i, '.webp') || '';
    const imgEl = (p.images && p.images.length)
        ? '<picture>'
          +   '<source srcset="' + webpR + '" type="image/webp">'
          +   '<img src="' + p.images[0] + '" alt="' + altText + '" loading="lazy" width="800" height="800" onerror="this.closest(\'picture\').style.display=\'none\';this.closest(\'picture\').nextElementSibling.style.display=\'\'">'
          + '</picture>'
          + '<i class="fas fa-' + icon + '" style="display:none"></i>'
        : '<i class="fas fa-' + icon + '"></i>';
    return '<div class="pcard">'
        + '<a class="pcard-link" href="urun-detay.html?id=' + p.id + '" aria-label="' + p.name + '"></a>'
        + '<div class="pcard-img">'
        +   imgEl
        +   (badgeCls ? '<span class="pcard-badge ' + badgeCls + '">' + badgeTxt + '</span>' : '')
        + '</div>'
        + '<div class="pcard-body">'
        +   '<div class="pcard-info">'
        +     '<div class="pcard-brand">' + p.brand + '</div>'
        +     '<div class="pcard-name">' + p.name + '</div>'
        +     '<div class="pcard-price">'
        +       (p.oldPrice ? '<small>' + formatPrice(p.oldPrice) + '</small>' : '')
        +       formatPrice(p.price)
        +     '</div>'
        +   '</div>'
        +   '<a href="https://wa.me/' + waNum + '?text=' + wa + '" class="pcard-wa" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Sipariş Ver</a>'
        + '</div>'
        + '</div>';
}

// ===== PRODUCTS DATA =====
function _imgs(slug, count) {
    const order = window.PHOTO_ORDER && window.PHOTO_ORDER[slug];
    const indices = (order && order.length) ? order : Array.from({length: count}, (_, i) => i + 1);
    const safePath = slug.replace(/ /g, '%20');
    return indices.map(n => 'images/products/' + safePath + '/' + safePath + '%20' + n + '.jpg');
}

const _elFeatures = ['Su geçirmez kumaş', 'UV koruyucu kaplama', 'Havalandırmalı tasarım', 'Kolay montaj sistemi', 'Yırtılmaz polyester'];
const _kasFeatures = ['Alüminyum çerçeve', 'Çift kapılı giriş', 'PVC + kumaş kompozit', 'Kış-yaz kullanım', 'Kolay söküp takma'];
const _elDesc = 'Elektrikli scooter ve motosikletinizi her mevsim koruyan, özel ölçülerine göre üretilmiş kabin sistemi. Güçlü çerçeve yapısı ve su geçirmez kumaşı ile yağmur, toz ve güneşe karşı tam koruma sağlar.';
const _kasDesc = '3 tekerlekli elektrikli araçlar için özel üretim, kasanıza tam oturan kabin çözümü. Alüminyum profil çerçeve ve yüksek dayanımlı PVC kaplama ile her hava koşuluna uygun, sağlam ve şık bir koruma.';
const _elSpecs = [{key:'Araç Tipi',value:'2 Tekerlekli Elektrikli'},{key:'Malzeme',value:'Su geçirmez polyester'},{key:'Çerçeve',value:'Galvanizli çelik'},{key:'Garanti',value:'2 Yıl'}];
const _kasSpecs = [{key:'Araç Tipi',value:'3 Tekerlekli Elektrikli'},{key:'Malzeme',value:'PVC + kumaş kompozit'},{key:'Çerçeve',value:'Alüminyum profil'},{key:'Garanti',value:'2 Yıl'}];

const products = [
    { id:1,  name:'Mondial E-Mon Capry',        brand:'Mondial',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249, badge:'En Popüler', description:_elDesc, features:_elFeatures, specs:_elSpecs, images:_imgs('Mondial E-Mon Capry',4) },
    { id:2,  name:'RKS Xigma',                  brand:'RKS',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249, badge:'Çok Satan', description:_elDesc, features:_elFeatures, specs:_elSpecs, images:_imgs('RKS Xigma',1) },
    { id:3,  name:'SFM Magneta E 1800',         brand:'SFM',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499, isNew:true,       description:_elDesc, features:_elFeatures, specs:_elSpecs, images:_imgs('sfm-magneta-e-1800',1) },
    { id:4,  name:'Volta VMS Neo',              brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499, badge:'En Popüler', description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('volta-vms-neo',2) },
    { id:5,  name:'SFM Ihlara SF 400',          brand:'SFM',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:10699,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('SFM Ihlara SF 400',3) },
    { id:6,  name:'Arora Rüzgar Pro',           brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:11699, badge:'Çok Satan', description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Rüzgar Pro',5) },
    { id:7,  name:'Volta Apec APM2',            brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Volta Apec APM2',0) },
    { id:8,  name:'Volta VM4',                  brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:17249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('volta-vm4',1) },
    { id:9,  name:'Yuki İki Kişilik',           brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:17249, badge:'Çok Satan', description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki İki Kişilik',12) },
    { id:10, name:'Kasalı Ön Kabin',            brand:'Diğer',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:[..._imgs('on-kabin-resim',36),..._imgs('on-kabin-kurulum',6)] },
    { id:11, name:'Kuba Optimus Max',           brand:'Kuba',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kuba Optimus Max',3) },
    { id:12, name:'Yuki Pony X',                brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249, badge:'Çok Satan', description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Pony X',14) },
    { id:13, name:'Yuki Tek Kişilik',           brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Tek Kişilik',8) },
    { id:14, name:'Volta Apec APM5',            brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Volta Apec APM5',3) },
    { id:15, name:'Altemur 3000',               brand:'Altemur',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:16, name:'Arora Angel Pro',            brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:10699,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Angel Pro',6) },
    { id:17, name:'CSN Confident',              brand:'CSN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('CSN Confident',7) },
    { id:18, name:'Arora Plus 220S',            brand:'Arora',    category:'4-tekerlekli', categoryLabel:'4 Tekerlekli Kabin', price:17499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:19, name:'Kral Vesta 5000',            brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:17249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral Vesta 5000',4) },
    { id:20, name:'Motolux Fayton 500 X',       brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249, badge:'Çok Satan', description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton 500 X',1) },
    { id:21, name:'Arora Navara New XLT 48A',   brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499, isNew:true,        description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Navara New XLT 48A',4) },
    { id:22, name:'Stmax Elit 940-960',         brand:'Stmax',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Stmax Elit 940-960',8) },
    { id:23, name:'JPN Avatar VIP',             brand:'JPN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:22499, isNew:true,        description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:24, name:'Skyjet Ecocar 15',           brand:'Skyjet',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Skyjet Ecocar 15',2) },
    { id:25, name:'Volta Apec APT4',            brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249, isNew:true,        description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Volta Apec APT4',0) },
    { id:26, name:'Arora Polo Plus 2024',       brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:17499, isNew:true,        description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Polo Plus 2024',5) },
    { id:27, name:'Skyjet Ecocar',              brand:'Skyjet',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Skyjet Ecocar',5) },
    { id:28, name:'Arora Rüzgar New',           brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Rüzgar New',4) },
    { id:29, name:'Motolux Fayton FX 08',       brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton FX 08',1) },
    { id:30, name:'Yuki Greta YK 59',           brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Greta YK 59',7) },
    { id:31, name:'Motolux Fayton 8100',        brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton 8100',5) },
    { id:32, name:'Meka Bus PRO 2000 W',        brand:'Meka',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Meka Bus PRO 2000 W',5) },
    { id:33, name:'Falcon Fulya 9000',          brand:'Falcon',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Falcon Fulya 9000',3) },
    { id:34, name:'RKS Optimus',                brand:'RKS',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('RKS Optimus',4) },
    { id:35, name:'Kral Mira',                  brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral Mira',7) },
    { id:36, name:'Jpn Anton',                  brand:'JPN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Jpn Anton',4) },
    { id:37, name:'Arora Felix Pro',            brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Felix Pro',4) },
    { id:38, name:'JPN Anton Maxct',            brand:'JPN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('JPN Anton Maxct',7) },
    { id:39, name:'Yuki YK 58',                 brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Greta YK 59',7) },
    { id:40, name:'Zlin Mutluluk',              brand:'Zlin',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Zlin Mutluluk',3) },
    { id:41, name:'Motolux Fayton 7700',        brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton 7700',6) },
    { id:42, name:'Motolux Fayton FX 44',       brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton FX 44',5) },
    { id:43, name:'Mona Liyon',                 brand:'Mona',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('mona-kurulum',42) },
    { id:44, name:'Yuki Pony Twin Plus',        brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Pony Twin Plus',0) },
    { id:45, name:'Kral KR-306 Tien',           brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral KR-306 Tien',4) },
    { id:46, name:'Lukdy Leksas',               brand:'Lukdy',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:47, name:'Arora Rüzgar New',           brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Rüzgar New',4) },
    { id:48, name:'Musatty Masilya Max 1600',   brand:'Musatty',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Musatty Masilya Max 1600',1) },
    { id:49, name:'Limme Triporter',            brand:'Limme',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:11699,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:50, name:'Arora Felix Pro Premium',    brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Felix Pro',4) },
    { id:51, name:'Kral B05',                   brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:52, name:'Motolux FX 23',              brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:11600,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux FX 23',2) },
    { id:53, name:'JPN Avatar',                 brand:'JPN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:54, name:'Zlin Truva',                 brand:'Zlin',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:55, name:'Stmax Smart 3000',           brand:'Stmax',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Stmax Smart 3000',1) },
    { id:56, name:'Meka Bus 2000 W',            brand:'Meka',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Meka Bus 2000 W',4) },
    { id:57, name:'Falcon Family 8000',         brand:'Falcon',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Falcon Family 8000',2) },
    { id:58, name:'Akeso Yagi',                 brand:'Akeso',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Akeso Yagi',4) },
    { id:59, name:'Arora Navara',               brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Navara',4) },
    { id:60, name:'Arora Derya',                brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:61, name:'Motolux Fayton FX22',        brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux Fayton FX22',2) },
    { id:62, name:'Motolux Fayton 7100',        brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:63, name:'Arora Mini Cargo',           brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Arora Mini Cargo',5) },
    { id:64, name:'Motolux FX 11',              brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Motolux FX 11',8) },
    { id:65, name:'Kuba Optimus Ultra',         brand:'Kuba',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:13499,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kuba Optimus Ultra',4) },
    { id:66, name:'Yuki YK-16 ILGAZ-X',        brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:21499, isNew:true,        description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki YK-16 ILGAZ-X',3) },
    { id:67, name:'Apachi Doru',                brand:'Apachi',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Apachi Doru',5) },
    { id:68, name:'Yuki Pony Twin Plus',        brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki Pony Twin Plus',0) },
    { id:69, name:'Arora XLT 48 Derya',        brand:'Arora',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:70, name:'Kuba Eco Pikap',             brand:'Kuba',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kuba Eco Pikap',3) },
    { id:71, name:'Apachi Q5',                  brand:'Apachi',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Apachi Q5',3) },
    { id:72, name:'Kral Ankaa',                 brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral Ankaa',4) },
    { id:73, name:'Volta VMS',                  brand:'Volta',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:16249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('volta-vms',1) },
    { id:74, name:'Kral Sarin',                 brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral Sarin',3) },
    { id:75, name:'Yuki YK-32 GRETA MİNİ',     brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki YK-32 GRETA MİNİ',11) },
    { id:76, name:'Yuki YK 32 Greta Pro',       brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki YK-32 GRETA MİNİ',11) },
    { id:77, name:'Leksas Humay',               brand:'Leksas',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:14249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:78, name:'JPN Tiger 3',                brand:'JPN',      category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs },
    { id:79, name:'Motolux 7700 X',             brand:'Motolux',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('motolux-7700-x',3) },

    // Yeni ürünler
    { id:80, name:'Falcon Julia 9000',          brand:'Falcon',   category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Falcon Julia 9000',6) },
    { id:81, name:'Kımmı Triporter',            brand:'Kımmı',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kımmı Triporter',9) },
    { id:82, name:'Kral Boss',                  brand:'Kral',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Kral Boss',45) },
    { id:83, name:'Mondial E-mon Mona',         brand:'Mondial',  category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Mondial E-mon Mona',4) },
    { id:84, name:'Stmax GF 200',               brand:'Stmax',    category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('stmax-gf-200',21) },
    { id:85, name:'Yuki YK-61 Caretta',         brand:'Yuki',     category:'3-tekerlekli', categoryLabel:'3 Tekerlekli Kabin', price:18249,                    description:_kasDesc, features:_kasFeatures, specs:_kasSpecs, images:_imgs('Yuki YK-61 Caretta',7) },
];

// ===== LOCAL FILTER / BRAND HELPERS (API fallback) =====
function filterProductsLocally(params) {
    let filtered = [...products];

    const category = params.get('category');
    if (category) filtered = filtered.filter(p => p.category === category);

    const brands = params.getAll('brand');
    if (brands.length) filtered = filtered.filter(p => brands.includes(p.brand));

    const priceMin = params.get('priceMin');
    if (priceMin) filtered = filtered.filter(p => p.price >= parseInt(priceMin));

    const priceMax = params.get('priceMax');
    if (priceMax) filtered = filtered.filter(p => p.price <= parseInt(priceMax));

    if (params.get('isNew') === 'true')      filtered = filtered.filter(p => p.isNew);
    if (params.get('hasDiscount') === 'true') filtered = filtered.filter(p => p.oldPrice);

    const search = params.get('search');
    if (search) {
        const qNorm = normalizeTR(search);
        if (window.Fuse) {
            const fuseList = filtered.map(p => ({ ...p, _n: normalizeTR(p.name), _b: normalizeTR(p.brand || '') }));
            const fuse = new window.Fuse(fuseList, {
                keys: [{ name: '_n', weight: 2 }, { name: '_b', weight: 1.5 }],
                threshold: 0.38,
                ignoreLocation: true
            });
            const origById = Object.fromEntries(filtered.map(p => [p.id, p]));
            filtered = fuse.search(qNorm).map(r => origById[r.item.id]);
        } else {
            filtered = filtered.filter(p =>
                normalizeTR(p.name).includes(qNorm) ||
                normalizeTR(p.brand || '').includes(qNorm)
            );
        }
    }

    const sortBy = params.get('sortBy') || 'newest';
    if (sortBy === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc')   filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    const page     = parseInt(params.get('page') || '1');
    const pageSize = parseInt(params.get('pageSize') || '12');
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { items, totalCount, totalPages };
}

function getBrandsLocally() {
    return [...new Set(products.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
}
