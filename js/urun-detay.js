// ===== PRODUCT DETAIL PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initCart();
    loadProduct();
    initTabs();
    initQuantity();
});

function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || window.location.hash.replace('#', '');
    const product = getProductById(id);

    if (!product) {
        document.querySelector('.product-detail .container').innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ürün Bulunamadı</h3>
                <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
                <a href="urunler.html" class="btn btn-primary">Ürünlere Dön</a>
            </div>`;
        return;
    }

    document.title = `${product.name} | Motor Tente Market`;

    // Breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;

    // Badge
    const badgeEl = document.getElementById('detailBadge');
    if (product.badge) { badgeEl.textContent = product.badge; badgeEl.style.display = 'inline-block'; }
    else { badgeEl.style.display = 'none'; }

    // Info
    document.getElementById('detailCategory').textContent = product.categoryLabel;
    document.getElementById('detailTitle').textContent = product.name;
    document.getElementById('detailBrand').innerHTML = `<i class="fas fa-tag"></i> Marka: <strong>${product.brand}</strong> &nbsp;|&nbsp; <i class="fas fa-barcode"></i> Ürün Kodu: <strong>MTM-${product.id.toString().padStart(4, '0')}</strong>`;

    // Price
    if (product.oldPrice) {
        document.getElementById('detailOldPrice').textContent = formatPrice(product.oldPrice);
        const discount = Math.round((1 - product.price / product.oldPrice) * 100);
        document.getElementById('detailDiscount').textContent = `%${discount} İndirim`;
        document.getElementById('detailDiscount').style.display = 'inline-block';
    } else {
        document.getElementById('detailOldPrice').style.display = 'none';
        document.getElementById('detailDiscount').style.display = 'none';
    }
    document.getElementById('detailPrice').textContent = formatPrice(product.price);

    // Description
    document.getElementById('detailDesc').textContent = product.description;

    // Features
    document.getElementById('detailFeatures').innerHTML = product.features.map(f =>
        `<div class="detail-feature-item"><i class="fas fa-check-circle"></i> ${f}</div>`
    ).join('');

    // WhatsApp link
    document.getElementById('whatsappOrder').href = `https://wa.me/905327748927?text=${encodeURIComponent(
        `Merhaba, "${product.name}" ürününü sipariş vermek istiyorum.\nÜrün Kodu: MTM-${product.id.toString().padStart(4, '0')}\nFiyat: ${formatPrice(product.price)}`
    )}`;

    // Add to cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('qtyInput').value) || 1;
        addToCart(product.id, qty);
    });

    // Tab content
    document.getElementById('tabDescription').innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <h4 style="margin-top: 24px;">Özellikler</h4>
        <ul class="desc-features">
            ${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
        <h4 style="margin-top: 24px;">Uyumlu Model</h4>
        <p>${product.specs?.['Uyumlu Model'] || product.brand}</p>
    `;

    // Specs table
    if (product.specs) {
        document.getElementById('specsTable').innerHTML = Object.entries(product.specs).map(([key, val]) =>
            `<tr><td>${key}</td><td>${val}</td></tr>`
        ).join('');
    }

    // Related products
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    document.getElementById('relatedProducts').innerHTML = related.map(p => productCardHTML(p)).join('');
}

// ===== TABS =====
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

// ===== QUANTITY =====
function initQuantity() {
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        input.value = Math.max(1, parseInt(input.value) - 1);
    });
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        input.value = parseInt(input.value) + 1;
    });
}
