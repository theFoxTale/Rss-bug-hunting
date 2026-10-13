const products = [
  { id: 1, name: "Кофе", price: 300 },
  { id: 2, name: "Чай", price: 200 },
  { id: 3, name: "Круассан", price: 150 },
  { id: 4, name: "Маффин", price: 180 },
];

let cart = [];
let discount = 0;

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cart-items");
const badgeEl = document.getElementById("badge");
const totalEl = document.getElementById("total");
const emptyMsg = document.getElementById("empty-msg");

const promoContainer = document.getElementById("promo");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-btn");

const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-btn");

function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `<h3>${product.name}</h3><p>${product.price} ₽</p>`;

    const btn = document.createElement("button");
    btn.textContent = "В корзину";
    btn.addEventListener("click", () => addToCart(product.id));
    card.appendChild(btn);

    productsEl.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    return;
  }

  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }

  renderCart();
}

function increaseQty(id) {
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.qty++;
  }

  renderCart();
}

function decreaseQty(id) {
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem && cartItem.qty > 1) {
    cartItem.qty--;
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function applyPromo() {
  if (promoInput.value === "SALE10") {
    discount = 0.1;
    errorEl.hidden = true;
  } else {
    discount = 0;
    errorEl.hidden = (promoInput.value === "");
  }
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  (cart.length === 0) ? renderEmptyCart() : renderFilledCart();
}

function renderEmptyCart() {
  totalEl.textContent = "0";
  emptyMsg.hidden = false;
  clearBtn.hidden = true;
  cartItemsEl.hidden = true;
  promoContainer.classList.add("is-hidden");
}

function renderFilledCart() {
  let totalSumma = 0;
  let itemsCount = 0;
  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;

    totalSumma += lineTotal;
    itemsCount += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `<span>${item.name}</span>
      <button class="qty-btn" data-act="dec">−</button>
      <span class="qty">${item.qty}</span>
      <button class="qty-btn" data-act="inc">+</button>
      <span class="line">${lineTotal} ₽</span>
      <button class="remove">✕</button>`;

    if (item.qty === 1) {
      li.querySelector('[data-act="dec"]').classList.add("hidden");
    }

    li.querySelector('[data-act="inc"]').addEventListener("click", () => increaseQty(item.id));
    li.querySelector('[data-act="dec"]').addEventListener("click", () => decreaseQty(item.id));
    li.querySelector(".remove").addEventListener("click", () => removeItem(item.id));

    cartItemsEl.appendChild(li);
  });

  if (discount) {
    totalSumma = totalSumma - totalSumma * discount;
  }

  badgeEl.textContent = itemsCount;
  totalEl.textContent = totalSumma;

  emptyMsg.hidden = true;
  clearBtn.hidden = false;
  cartItemsEl.hidden = false;
  promoContainer.classList.remove("is-hidden");
}

promoBtn.addEventListener("click", applyPromo);
clearBtn.addEventListener("click", clearCart);

renderProducts();
renderCart();
