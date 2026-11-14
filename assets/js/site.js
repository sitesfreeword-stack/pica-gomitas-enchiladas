const PRODUCTS = [
  { id: 'chispa', name: 'La Chispa', size: '50 g', price: 3000, heat: 'Suave', description: 'Un toque dulce con picante ligero.', pack: '#f0442e', accent: '#f8d43a', tag: 'PARA PROBAR', image: '7033824', alt: 'Gomitas de colores con azúcar' },
  { id: 'clasica', name: 'La Clásica', size: '100 g', price: 5000, heat: 'Medio', description: 'El equilibrio entre dulce, ácido y chile.', pack: '#d93138', accent: '#ff8f9e', tag: 'FAVORITA DEL MIX', image: '884509', alt: 'Gomitas rojas y amarillas' },
  { id: 'atrevida', name: 'La Atrevida', size: '100 g', price: 5500, heat: 'Intenso', description: 'Más carácter para quienes aman el picante.', pack: '#9f243c', accent: '#a7c83a', tag: 'MÁS PICANTE', image: '18958642', alt: 'Gomitas coloridas en primer plano' },
  { id: 'duo', name: 'Dúo de antojos', size: '2 × 50 g', price: 5500, heat: 'Suave + medio', description: 'Dos niveles para compartir o comparar.', pack: '#ef704a', accent: '#f8d43a', tag: 'PARA COMPARTIR', image: '31665692', alt: 'Gomitas de varios colores en un recipiente' },
  { id: 'combo', name: 'Combo PICA', size: '3 × 100 g', price: 14000, heat: 'Suave + medio + intenso', description: 'La experiencia completa en tres bolsas.', pack: '#bf2847', accent: '#fd927f', tag: 'MIX COMPLETO', image: '2231611', alt: 'Tazón de gomitas de colores' },
  { id: 'fiesta', name: 'Bolsa de parche', size: '250 g', price: 12000, heat: 'A tu gusto', description: 'Una presentación grande para compartir.', pack: '#e8442f', accent: '#a9c83e', tag: 'TAMAÑO PARA COMPARTIR', image: '5744302', alt: 'Dulces gomosos en un tazón' }
];

const CART_KEY = 'pica-demo-cart-v1';
const WHATSAPP_NUMBER = '573113297190';
const money = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
const internalPage = (page) => `${location.pathname.includes('/pages/') ? '' : 'pages/'}${page}`;
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); }
  catch { return {}; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCounts(); updateFloatingCart(); }
function getWhatsAppOrderUrl(cart) {
  const selected = PRODUCTS.filter((product) => cart[product.id] > 0);
  const subtotal = selected.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const lines = selected.map((product) => `• ${product.name} (${product.size}) × ${cart[product.id]} = ${money(product.price * cart[product.id])}`);
  const message = ['Hola, quiero hacer este pedido de gomitas PICA:', '', ...lines, '', `Subtotal estimado: ${money(subtotal)}`, 'Envío: por confirmar.', '¿Me confirman disponibilidad, entrega y valor final?'].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function updateCartCounts() {
  const count = Object.values(readCart()).reduce((total, quantity) => total + quantity, 0);
  document.querySelectorAll('.cart-count').forEach((node) => { node.textContent = count; });
}

function renderProducts() {
  const grid = document.querySelector('#product-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((product) => `
    <article class="product-card">
      <div class="product-visual" style="--product-accent:${product.accent};--product-pack:${product.pack}">
        <img class="product-photo" src="https://images.pexels.com/photos/${product.image}/pexels-photo-${product.image}.jpeg?auto=compress&cs=tinysrgb&w=900" alt="${product.alt}" loading="lazy"><span class="product-tag">${product.tag}</span><div class="pack"><span class="pack-label">PICA<br>¡PICA!</span></div>
      </div>
      <div class="product-info"><h2>${product.name}</h2><p>${product.description}</p><div class="product-meta"><span>${product.size} · ${product.heat}</span><strong class="product-price">${money(product.price)}</strong></div><button class="add-button" type="button" data-add="${product.id}">AGREGAR AL CARRITO +</button></div>
    </article>`).join('');
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    addToCart(button.dataset.add);
    button.textContent = '¡AGREGADA! ✓';
    window.setTimeout(() => { button.textContent = 'AGREGAR AL CARRITO +'; }, 1100);
  });
}

function renderCarousel() {
  const carousel = document.querySelector('#product-carousel');
  if (!carousel) return;
  carousel.innerHTML = PRODUCTS.map((product, index) => `
    <article class="carousel-card" style="--card-index:${index}">
      <a class="carousel-image" href="pages/tienda.html" aria-label="Ver ${product.name} en la tienda"><img src="https://images.pexels.com/photos/${product.image}/pexels-photo-${product.image}.jpeg?auto=compress&cs=tinysrgb&w=900" alt="${product.alt}" loading="lazy"><span class="carousel-chip">${product.tag}</span><span class="carousel-number">0${index + 1} / 06</span></a>
      <div class="carousel-card-info"><div><span class="product-heat">${product.heat} · ${product.size}</span><h3>${product.name}</h3><p>${product.description}</p></div><div class="carousel-buy"><strong>${money(product.price)}</strong><button type="button" class="quick-add" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">+</button></div></div>
    </article>`).join('');
  carousel.addEventListener('click', (event) => {
    if (carousel.classList.contains('was-dragged')) { event.preventDefault(); carousel.classList.remove('was-dragged'); return; }
    const button = event.target.closest('[data-add]');
    if (!button) return;
    addToCart(button.dataset.add);
    button.textContent = '✓';
    window.setTimeout(() => { button.textContent = '+'; }, 1000);
  });
  let dragStart = null;
  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragStart = { x: event.clientX, scroll: carousel.scrollLeft };
    carousel.classList.add('is-dragging');
    carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const distance = event.clientX - dragStart.x;
    if (Math.abs(distance) > 5) carousel.classList.add('was-dragged');
    carousel.scrollLeft = dragStart.scroll - distance;
  });
  const stopDragging = () => { dragStart = null; carousel.classList.remove('is-dragging'); };
  carousel.addEventListener('pointerup', stopDragging);
  carousel.addEventListener('pointercancel', stopDragging);
  document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => carousel.scrollBy({ left: -carousel.clientWidth * .8, behavior: 'smooth' }));
  document.querySelector('[data-carousel-next]')?.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * .8, behavior: 'smooth' }));
}

function addToCart(id) {
  const cart = readCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
}

function setupFloatingCart() {
  if (document.querySelector('.floating-cart-host')) return;
  const host = document.createElement('div');
  host.className = 'floating-cart-host';
  host.innerHTML = `<button class="floating-cart-trigger" type="button" aria-expanded="false" aria-controls="floating-cart-drawer"><svg class="bag-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l1 13H4L5 8Z" stroke="currentColor" stroke-width="1.7"/><path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span class="floating-label">MI BOLSA</span><span class="floating-count">0</span></button><div class="cart-scrim" data-cart-close></div><aside class="floating-cart-drawer" id="floating-cart-drawer" aria-hidden="true" aria-label="Resumen de compra"><div class="drawer-head"><div><span class="eyebrow">ANTOJO EN CURSO</span><h2>Tu bolsa<span class="drawer-count"> (0)</span></h2></div><button class="drawer-close" type="button" data-cart-close aria-label="Cerrar carrito">×</button></div><div class="drawer-items"></div><div class="drawer-bottom"><div class="drawer-total"><span>Subtotal</span><strong class="drawer-subtotal">$0</strong></div><a class="pill-button drawer-cart-link" href="${internalPage('carrito.html')}">VER CARRITO COMPLETO <span>↗</span></a><a class="whatsapp-order drawer-whatsapp" target="_blank" rel="noopener noreferrer">PEDIR POR WHATSAPP <span>↗</span></a><p>WhatsApp abrirá el pedido para revisarlo y enviarlo.</p></div></aside>`;
  document.body.append(host);
  const trigger = host.querySelector('.floating-cart-trigger');
  const drawer = host.querySelector('.floating-cart-drawer');
  const setOpen = (open) => {
    host.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('cart-open', open);
  };
  trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
  host.querySelectorAll('[data-cart-close]').forEach((button) => button.addEventListener('click', () => setOpen(false)));
  host.querySelector('.drawer-whatsapp').addEventListener('click', (event) => {
    if (event.currentTarget.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  host.querySelector('.drawer-items').addEventListener('click', (event) => {
    const button = event.target.closest('[data-mini-inc],[data-mini-dec],[data-mini-remove]');
    if (!button) return;
    const id = button.dataset.miniInc || button.dataset.miniDec || button.dataset.miniRemove;
    const cart = readCart();
    if (button.dataset.miniRemove || button.dataset.miniDec && cart[id] <= 1) delete cart[id];
    else if (button.dataset.miniInc) cart[id] += 1;
    else cart[id] -= 1;
    saveCart(cart);
    if (document.querySelector('#cart-content')) renderCart();
  });
  updateFloatingCart();
}

function updateFloatingCart() {
  const host = document.querySelector('.floating-cart-host');
  if (!host) return;
  const cart = readCart();
  const items = PRODUCTS.filter((product) => cart[product.id] > 0);
  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const subtotal = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  host.querySelector('.floating-count').textContent = count;
  host.querySelector('.drawer-count').textContent = ` (${count})`;
  host.querySelector('.drawer-subtotal').textContent = money(subtotal);
  const orderLink = host.querySelector('.drawer-whatsapp');
  orderLink.href = getWhatsAppOrderUrl(cart);
  orderLink.setAttribute('aria-disabled', String(count === 0));
  orderLink.classList.toggle('is-disabled', count === 0);
  host.querySelector('.drawer-items').innerHTML = items.length ? items.map((product) => `<article class="drawer-item"><img src="https://images.pexels.com/photos/${product.image}/pexels-photo-${product.image}.jpeg?auto=compress&cs=tinysrgb&w=180" alt="" loading="lazy"><div class="drawer-item-copy"><h3>${product.name}</h3><span>${money(product.price)} · ${product.size}</span><div class="drawer-quantity"><button type="button" data-mini-dec="${product.id}" aria-label="Quitar una unidad">−</button><span>${cart[product.id]}</span><button type="button" data-mini-inc="${product.id}" aria-label="Agregar una unidad">+</button></div></div><button class="drawer-remove" type="button" data-mini-remove="${product.id}" aria-label="Eliminar ${product.name}">×</button></article>`).join('') : `<div class="drawer-empty"><span>✳</span><h3>La bolsa está ligera.</h3><p>Elige un mix para empezar.</p><a href="${internalPage('tienda.html')}">EXPLORAR SABORES ↗</a></div>`;
}

function renderCart() {
  const host = document.querySelector('#cart-content');
  if (!host) return;
  const cart = readCart();
  const selected = PRODUCTS.filter((product) => cart[product.id] > 0);
  if (!selected.length) {
    host.innerHTML = `<div class="empty-cart"><h2>Tu carrito está esperando.</h2><p>Explora los sabores y agrega tu primer antojo.</p><a class="pill-button" href="${internalPage('tienda.html')}">IR A LA TIENDA <span>↗</span></a></div>`;
    return;
  }
  const subtotal = selected.reduce((total, product) => total + product.price * cart[product.id], 0);
  host.innerHTML = `<div class="cart-items">${selected.map((product) => `
    <article class="cart-row"><div><h3>${product.name}</h3><p>${product.size} · ${product.heat}</p></div><div class="quantity-controls"><button type="button" data-decrease="${product.id}" aria-label="Quitar una unidad de ${product.name}">−</button><span>${cart[product.id]}</span><button type="button" data-increase="${product.id}" aria-label="Agregar una unidad de ${product.name}">+</button></div><strong class="cart-line-price">${money(product.price * cart[product.id])}</strong><button class="remove-button" type="button" data-remove="${product.id}" aria-label="Eliminar ${product.name}">×</button></article>`).join('')}</div>
    <aside class="cart-summary"><h2>Resumen</h2><div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-row"><span>Envío</span><span>Por confirmar</span></div><div class="summary-row summary-total"><span>Total estimado</span><span>${money(subtotal)}</span></div><a class="pill-button whatsapp-checkout" href="${getWhatsAppOrderUrl(cart)}" target="_blank" rel="noopener noreferrer">CONTINUAR POR WHATSAPP <span>↗</span></a><p class="form-note">Revisa el pedido y envía el mensaje para confirmar. El envío se acuerda por WhatsApp.</p></aside>`;
  host.onclick = (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = button.dataset.increase || button.dataset.decrease || button.dataset.remove;
    if (id) {
      const next = readCart();
      if (button.dataset.remove || button.dataset.decrease && next[id] <= 1) delete next[id];
      else if (button.dataset.increase) next[id] += 1;
      else next[id] -= 1;
      saveCart(next);
      renderCart();
    }
  };
}

function setupNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!menuButton || !nav) return;
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
  }));
}

function setupContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#form-status').textContent = '¡Gracias! El formulario es una demostración y el mensaje no fue enviado.';
    form.reset();
  });
}

function setupVideoFallback() {
  if (window.location.protocol !== 'file:') return;
  const frame = document.querySelector('.video-frame');
  if (!frame) return;
  const player = frame.querySelector('iframe');
  if (window.location.protocol === 'file:') {
    frame.classList.add('video-file-mode');
    player?.remove();
  } else if (player?.dataset.src) {
    player.src = player.dataset.src;
  }
  if (window.location.protocol !== 'file:') return;
  const note = document.createElement('p');
  note.className = 'video-file-notice';
  note.textContent = 'Para ver el video integrado, abre el sitio desde un servidor local. También puedes abrirlo directamente en YouTube.';
  frame.append(note);
}

setupNavigation();
setupFloatingCart();
updateCartCounts();
renderProducts();
renderCarousel();
renderCart();
setupContactForm();
setupVideoFallback();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll('.section-label,.intro-grid,.flavor-card,.product-card,.carousel-card,.explainer-copy,.video-frame,.team-card');
  revealItems.forEach((item) => item.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}
