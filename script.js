const DISCORD_WEBHOOK_URL = "DEINE_DISCORD_WEBHOOK_URL_HIER_EINFUEGEN";

let cart = JSON.parse(localStorage.getItem('marcelctg_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateCartCount();
    setupCartDrawer();
});

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.querySelector('.nav-links');
    if (btn && links) {
        btn.addEventListener('click', () => {
            links.classList.toggle('active');
        });
    }
}

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function setupCartDrawer() {
    if (!document.getElementById('cartDrawer')) {
        const drawerHTML = `
        <div id="cartDrawer" class="cart-drawer">
            <div class="cart-header">
                <h3>Dein Warenkorb</h3>
                <button onclick="toggleCart()" style="background:none;border:none;color:var(--text-main);font-size:1.2rem;cursor:pointer;">&times;</button>
            </div>
            <div id="cartItemsContainer" class="cart-items"></div>
            <div class="cart-footer">
                <div style="display:flex; justify-content:space-between; font-weight:700;">
                    <span>Gesamtsumme:</span>
                    <span id="cartTotal">0,00 €</span>
                </div>
                <button onclick="openCheckoutModal()" class="btn-primary" style="width:100%; justify-content:center;">Zur Kasse & Kaufen</button>
            </div>
        </div>
        <div id="checkoutModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; justify-content:center; align-items:center; padding:1rem;">
            <div style="background:var(--bg-card); border:1px solid var(--border); padding:2rem; border-radius:12px; width:100%; max-width:450px; position:relative;">
                <h3 style="margin-bottom:1rem; color:var(--accent);">Checkout abschließen</h3>
                <form id="checkoutForm" onsubmit="handleCheckout(event)">
                    <div style="margin-bottom:1rem;">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">Dein Discord-Benutzername (Pflicht)</label>
                        <input type="text" id="discordUser" required placeholder="z.B. MarcelCTG#1337" style="width:100%; padding:0.8rem; background:var(--bg-main); border:1px solid var(--border); color:var(--text-main); border-radius:6px;">
                    </div>
                    <div style="margin-bottom:1rem;">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">E-Mail-Adresse</label>
                        <input type="email" id="customerEmail" required placeholder="name@beispiel.de" style="width:100%; padding:0.8rem; background:var(--bg-main); border:1px solid var(--border); color:var(--text-main); border-radius:6px;">
                    </div>
                    <div style="display:flex; gap:1rem; margin-top:1.5rem;">
                        <button type="button" onclick="closeCheckoutModal()" class="btn-secondary" style="flex:1; justify-content:center;">Abbrechen</button>
                        <button type="submit" class="btn-primary" style="flex:1; justify-content:center;">Zahlung simulieren</button>
                    </div>
                </form>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }
    renderCartItems();
}

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.classList.toggle('open');
        renderCartItems();
    }
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('marcelctg_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    toggleCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('marcelctg_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    if (!container || !totalEl) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:2rem;">Dein Warenkorb ist leer.</p>';
        totalEl.textContent = '0,00 €';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
        <div class="cart-item">
            <div>
                <h4 style="font-size:0.95rem; margin-bottom:0.2rem;">${item.name}</h4>
                <span style="color:var(--text-muted); font-size:0.85rem;">${item.quantity}x - ${(item.price * item.quantity).toFixed(2)} €</span>
            </div>
            <button onclick="removeFromCart('${item.name}')" style="background:none;border:none;color:#ff5555;cursor:pointer;font-size:1rem;">&times;</button>
        </div>`;
    });
    container.innerHTML = html;
    totalEl.textContent = total.toFixed(2) + ' €';
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Dein Warenkorb ist leer!");
        return;
    }
    toggleCart();
    document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

async function handleCheckout(event) {
    event.preventDefault();
    const discordUser = document.getElementById('discordUser').value;
    const email = document.getElementById('customerEmail').value;
    
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let itemsList = cart.map(i => `• ${i.quantity}x ${i.name} (${(i.price * i.quantity).toFixed(2)} €)`).join('\n');

    const payload = {
        embeds: [{
            title: "🛒 Neuer Shop-Kauf eingegangen!",
            color: 65280,
            fields: [
                { name: "👤 Discord User", value: discordUser, inline: true },
                { name: "📧 E-Mail", value: email, inline: true },
                { name: "📦 Produkte", value: itemsList, inline: false },
                { name: "💰 Gesamtsumme", value: `${total.toFixed(2)} €`, inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== "DEINE_DISCORD_WEBHOOK_URL_HIER_EINFUEGEN") {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error("Webhook Fehler:", err);
        }
    } else {
        alert("Simulierter Kauf erfolgreich! Trage in script.js deine echte Discord-Webhook-URL ein, um Live-Nachrichten zu erhalten.");
    }

    cart = [];
    localStorage.removeItem('marcelctg_cart');
    updateCartCount();
    closeCheckoutModal();
    alert("Vielen Dank für deinen Einkauf!");
}
