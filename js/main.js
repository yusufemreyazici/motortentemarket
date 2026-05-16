// ===== HOMEPAGE =====
document.addEventListener('DOMContentLoaded', async () => {
    initHeader();
    await loadHomeProducts();
});

async function loadHomeProducts() {
    try {
        const resp = await fetch(`${API_BASE}/api/products?pageSize=20&sortBy=newest`);
        if (!resp.ok) throw new Error();
        const { items } = await resp.json();
        renderFeatured(items);
        renderBestsellers(items);
        renderMobileStrip(items);
        // Apply settings now that cards are in DOM (WA links etc.)
        if (window._siteSettings) applySettingsToDOM(window._siteSettings);
    } catch {
        // Static fallback
        if (typeof products !== 'undefined') {
            renderFeatured(products);
            renderBestsellers(products);
            renderMobileStrip(products);
        }
    }
}

function renderFeatured(productList) {
    const el = document.getElementById('featuredGrid');
    if (!el) return;
    const items = productList.filter(p => p.badge)
        .concat(productList.filter(p => !p.badge))
        .slice(0, 10);
    if (!items.length) return;
    makeCarousel(el, items);
}

function renderBestsellers(productList) {
    const el = document.getElementById('bestsellersShelf');
    if (!el) return;
    const top = productList
        .filter(p => p.badge === 'Çok Satan' || p.badge === 'En Popüler')
        .concat(productList.filter(p => p.badge !== 'Çok Satan' && p.badge !== 'En Popüler'))
        .slice(0, 10);
    if (!top.length) return;
    makeCarousel(el, top);
}

function renderMobileStrip(productList) {
    const el = document.getElementById('mobStrip');
    if (!el || window.innerWidth > 767) return;
    const items = productList
        .filter(p => p.badge)
        .concat(productList.filter(p => !p.badge && p.images && p.images.length))
        .slice(0, 12);
    if (!items.length) return;
    el.innerHTML = items.map(p => productCardHTML(p)).join('');

    // Otomatik scroll — 3sn aralıkla, dokunuşta durur
    const cardW = () => el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : el.offsetWidth * 0.72 + 12;
    let timer = setInterval(() => {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft + cardW() >= maxScroll - 4) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            el.scrollBy({ left: cardW(), behavior: 'smooth' });
        }
    }, 3000);
    el.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
}

function makeCarousel(el, items) {
    if (!el || !items.length) return;

    if (window.innerWidth <= 599) {
        el.innerHTML = '<div class="crsl-scroll">' + items.map(p => productCardHTML(p)).join('') + '</div>';
        return;
    }

    el.innerHTML =
        '<div class="crsl">' +
            '<button class="crsl-btn crsl-btn--prev" aria-label="Önceki" disabled><i class="fas fa-chevron-left"></i></button>' +
            '<div class="crsl-viewport">' +
                '<div class="crsl-track">' + items.map(p => productCardHTML(p)).join('') + '</div>' +
            '</div>' +
            '<button class="crsl-btn crsl-btn--next" aria-label="Sonraki"><i class="fas fa-chevron-right"></i></button>' +
        '</div>';

    const track  = el.querySelector('.crsl-track');
    const btnP   = el.querySelector('.crsl-btn--prev');
    const btnN   = el.querySelector('.crsl-btn--next');
    const cards  = track.children;
    const total  = cards.length;
    let cur      = 0;
    let timer    = null;

    function vis() {
        const w = window.innerWidth;
        if (w < 600)  return 1;
        if (w < 900)  return 2;
        if (w < 1200) return 3;
        return 5;
    }

    function maxIdx() { return Math.max(0, total - vis()); }

    function goTo(n) {
        cur = Math.max(0, Math.min(maxIdx(), n));
        const cardW = (cards[0] ? cards[0].offsetWidth : 0) + 16;
        track.style.transform = 'translateX(-' + (cur * cardW) + 'px)';
        btnP.disabled = cur === 0;
        btnN.disabled = cur >= maxIdx();
    }

    function startTimer() {
        stopTimer();
        timer = setInterval(function () {
            goTo(cur >= maxIdx() ? 0 : cur + 1);
        }, 3000);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    btnP.addEventListener('click', function () { stopTimer(); goTo(cur - 1); startTimer(); });
    btnN.addEventListener('click', function () { stopTimer(); goTo(cur + 1); startTimer(); });

    el.addEventListener('mouseenter', stopTimer);
    el.addEventListener('mouseleave', startTimer);

    let touchX = 0;
    track.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stopTimer(); goTo(cur + (diff > 0 ? 1 : -1)); startTimer(); }
    });

    window.addEventListener('resize', function () { goTo(Math.min(cur, maxIdx())); });

    goTo(0);
    startTimer();
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.getElementById('cartOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }
});
