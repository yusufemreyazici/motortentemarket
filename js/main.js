// ===== HOMEPAGE v2 =====
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initHeader();
    renderFeatured();
    renderBestsellers();
});

function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid || typeof products === 'undefined') return;
    const items = products.filter(p => p.badge).concat(products.filter(p => !p.badge)).slice(0, 4);
    grid.innerHTML = items.map(p => productCardHTML(p)).join('');
}

function renderBestsellers() {
    const shelf = document.getElementById('bestsellersShelf');
    if (!shelf || typeof products === 'undefined') return;
    const top = products.filter(p => p.badge === 'Çok Satan' || p.badge === 'En Popüler')
                        .concat(products.filter(p => p.badge !== 'Çok Satan' && p.badge !== 'En Popüler'))
                        .slice(0, 8);
    shelf.innerHTML = top.map(p => productCardHTML(p)).join('');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('cartOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }
});
