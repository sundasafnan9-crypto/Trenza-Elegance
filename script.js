const products = [
  {id:1, name:"Blush wrap dress", price:4200, cat:"dresses", color:"#E8C9BE", image:"Blush wrap dress.png"},
  {id:2, name:"Clay midi dress", price:3800, cat:"dresses", color:"#D9AE9E", image:"Clay midi dress.png"},
  {id:3, name:"Ivory linen dress", price:4600, cat:"dresses", color:"#F0E6DE", image:"Ivory linen dress.png"},
  {id:4, name:"Rosewood Satin Dress", price:5200, cat:"dresses", color:"#DDB5A8", image:"Rosewood Satin Dress.png"},
  {id:5, name:"Silk scarf, dune", price:1500, cat:"accessories", color:"#F7E6E0", image:"Silk scarf, dune.png"},
  {id:6, name:"Beaded drop earrings", price:1200, cat:"accessories", color:"#E3CFC4", image:"Beaded drop earrings.png"},
  {id:7, name:"Woven tote bag", price:2600, cat:"accessories", color:"#EAD9CE", image:"Woven tote bag.png"},
  {id:8, name:"Pearl hair clip set", price:900, cat:"accessories", color:"#F3E8E1", image:"Pearl hair clip set.png"},
  {id:9, name:"Cream cable knit", price:3400, cat:"knitwear", color:"#EFE3DA", image:"Cream cable knit.png"},
  {id:10, name:"Oat cardigan", price:3100, cat:"knitwear", color:"#E6D6C8", image:"Oat cardigan.png"},
  {id:11, name:"Rose melange sweater", price:3600, cat:"knitwear", color:"#E0BEB0", image:"Rose melange sweater.png"},
  {id:12, name:"Cocoa knit vest", price:2800, cat:"knitwear", color:"#D8C2AE", image:"Cocoa knit vest.png"},
];

let cart = [];
let activeCategory = "all";

const icons = {
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
};

function renderIcons(){
  document.querySelectorAll('[data-icon]').forEach(el=>{
    el.innerHTML = icons[el.getAttribute('data-icon')] || '';
  });
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  const list = activeCategory === 'all' ? products : products.filter(p=>p.cat===activeCategory);
  grid.innerHTML = list.map(p=>`
    <div class="product-card">
      <div class="product-image" style="background-image:url('${p.image}'); background-size:cover; background-position:center;"></div>
      <div class="product-body">
        <p class="product-name">${p.name}</p>
        <p class="product-price">Rs ${p.price.toLocaleString()}</p>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to bag</button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat){
  activeCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  renderProducts();
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
}

function addToCart(id){
  const product = products.find(p=>p.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; } else { cart.push({...product, qty:1}); }
  renderCart();
  showToast(`${product.name} added to bag`);
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(i=>i.id!==id); }
  renderCart();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  renderCart();
}

function renderCart(){
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  countEl.textContent = totalQty;
  countEl.style.display = totalQty > 0 ? 'flex' : 'none';

  if(cart.length === 0){
    container.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
  } else {
    container.innerHTML = cart.map(item=>`
      <div class="cart-item">
        <div class="cart-item-img" style="background:${item.color}"></div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">Rs ${item.price.toLocaleString()}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  totalEl.textContent = `Rs ${total.toLocaleString()}`;
}

function toggleCart(){
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function toggleMenu(){
  document.getElementById('mainNav').classList.toggle('open');
}

function toggleSearch(){
  document.getElementById('searchBar').classList.toggle('open');
}

function checkout(){
  if(cart.length === 0){
    showToast('Your bag is empty');
    return;
  }

  document.getElementById("checkoutModal").style.display="flex";
}

function closeCheckout(){
  document.getElementById("checkoutModal").style.display="none";
}

function placeOrder(e){
  e.preventDefault();
  closeCheckout();
  cart=[];
  renderCart();
  showToast("Order placed successfully ❤️");
}

function subscribeNewsletter(e){
  e.preventDefault();
  showToast('You are on the list');
  e.target.reset();
  return false;
}

let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2200);
}

renderIcons();
renderProducts();
renderCart();

/*==============================
      LOGIN / REGISTER MODAL
==============================*/

// Open / Close Modal
function toggleAuth(){

    const modal = document.getElementById("authModal");

    if(modal.style.display === "flex"){

        modal.style.display = "none";

    }else{

        modal.style.display = "flex";

    }

}


// Login Form Show
function showLogin(){

    document.getElementById("loginForm").style.display = "block";

    document.getElementById("registerForm").style.display = "none";

}


// Register Form Show
function showRegister(){

    document.getElementById("loginForm").style.display = "none";

    document.getElementById("registerForm").style.display = "block";

}


// Password Eye
function togglePassword(id, eye){

    const input = document.getElementById(id);

    if(input.type === "password"){

        input.type = "text";

        eye.innerHTML = "🙈";

    }else{

        input.type = "password";

        eye.innerHTML = "👁";

    }

}


// Close When Clicking Outside
window.addEventListener("click",function(e){

    const modal = document.getElementById("authModal");

    if(e.target === modal){

        modal.style.display = "none";

    }

});


// ESC Key Close
document.addEventListener("keydown",function(e){

    if(e.key === "Escape"){

        document.getElementById("authModal").style.display="none";

    }

});