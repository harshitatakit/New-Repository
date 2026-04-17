function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ---------- HOMEPAGE ---------- */

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p class="price">₹${p.price}</p>
        <p>⭐ ${p.rating}</p>

        <select id="qty-${p.id}">
          <option value="1">Qty: 1</option>
          <option value="2">Qty: 2</option>
          <option value="3">Qty: 3</option>
          <option value="4">Qty: 4</option>
          <option value="5">Qty: 5</option>
        </select>

        <button id="btn-${p.id}" onclick="addToCart('${p.id}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

function addToCart(id) {
  const qty = Number(document.getElementById(`qty-${id}`).value);
  let cart = getCart();

  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
  } else {
    cart.push({ id, qty });
  }

  saveCart(cart);

  const btn = document.getElementById(`btn-${id}`);
  btn.innerText = "Added ✔";
  btn.disabled = true;
  btn.style.background = "#c8f2c2";
}

/* ---------- CART PAGE ---------- */

function renderCart() {
  const cartDiv = document.getElementById("cart");
  const subtotalDiv = document.getElementById("subtotal");
  if (!cartDiv) return;

  const cart = getCart();
  let subtotal = 0;

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your Amazon Cart is empty.</p>";
    return;
  }

  cart.forEach(c => {
    const p = products.find(p => p.id === c.id);
    subtotal += p.price * c.qty;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}">
        <div>
          <h4>${p.name}</h4>
          <p class="price">₹${p.price}</p>

          <select onchange="updateQty('${p.id}', this.value)">
            ${[1,2,3,4,5].map(q =>
              `<option ${q==c.qty?'selected':''}>${q}</option>`
            ).join("")}
          </select>

          <button onclick="removeItem('${p.id}')">Remove</button>
        </div>
      </div>
    `;
  });

  subtotalDiv.innerText = `Subtotal: ₹${subtotal}`;
}

function updateQty(id, qty) {
  const cart = getCart();
  cart.find(i => i.id === id).qty = Number(qty);
  saveCart(cart);
  location.reload();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  location.reload();
}
/* ---------- CHECKOUT ---------- */

function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = {
    id: "ORD" + Date.now(),
    items: cart,
    total: cart.reduce((sum, c) => {
      const p = products.find(p => p.id === c.id);
      return sum + p.price * c.qty;
    }, 0),
    date: new Date().toLocaleString(),
    status: "Ordered"
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  window.location.href = "orders.html";
}

/* ---------- ORDERS PAGE ---------- */

function renderOrders() {
  const container = document.getElementById("orders");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders placed yet.</p>";
    return;
  }

  orders.forEach(o => {
    container.innerHTML += `
      <div class="order">
        <h3>Order ID: ${o.id}</h3>
        <p>Date: ${o.date}</p>
        <p>Status: <b>${o.status}</b></p>
        <p>Total: ₹${o.total}</p>

        ${o.items.map(i => {
          const p = products.find(p => p.id === i.id);
          return `<p>${p.name} (Qty: ${i.qty})</p>`;
        }).join("")}
      </div>
    `;
  });
}