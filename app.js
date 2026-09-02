const foodItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 12.99,
        category: "Pizza",
        veg: true,
        tag: "Veg",
        featured: true,
        description: "Stone-fired crust with San Marzano tomatoes, fresh mozzarella, and sweet basil.",
        ingredients: ["00 Flour", "San Marzano Tomatoes", "Fresh Mozzarella", "Fresh Basil", "Extra Virgin Olive Oil"],
        nutrition: { calories: "680 kcal", carbs: "75g", protein: "22g" },
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Smoky Bacon & Cheddar Burger",
        price: 15.99,
        category: "Burgers",
        veg: false,
        tag: "Non-Veg",
        featured: true,
        description: "Charbroiled Angus patty, aged cheddar, Applewood smoked bacon, and house sauce.",
        ingredients: ["Angus Beef Patty", "Brioche Bun", "Aged Cheddar", "Smoked Bacon", "Pickles"],
        nutrition: { calories: "820 kcal", carbs: "48g", protein: "44g" },
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Zesty Guacamole Rice Bowl",
        price: 11.50,
        category: "Bowls",
        veg: true,
        tag: "Gluten-Free",
        featured: true,
        description: "Organic brown rice, charred corn, black beans, citrus guacamole, and cilantro.",
        ingredients: ["Organic Brown Rice", "Avocado", "Black Beans", "Sweet Corn", "Cilantro Lime Dressing"],
        nutrition: { calories: "450 kcal", carbs: "58g", protein: "14g" },
        image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Crispy Baja Fish Tacos",
        price: 13.99,
        category: "Tacos",
        veg: false,
        tag: "Non-Veg",
        featured: false,
        description: "Crispy battered cod fillet, chipotle crema, and purple cabbage slaw on corn tortillas.",
        ingredients: ["Wild Cod", "White Corn Tortillas", "Chipotle Aioli", "Red Cabbage", "Lime"],
        nutrition: { calories: "510 kcal", carbs: "42g", protein: "28g" },
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Tiramisu Classico",
        price: 7.99,
        category: "Desserts",
        veg: true,
        tag: "Veg",
        featured: false,
        description: "Traditional espresso-soaked ladyfingers layered with mascarpone cream and cocoa.",
        ingredients: ["Savoiardi Ladyfingers", "Mascarpone Cream", "Espresso", "Dark Cocoa Powder"],
        nutrition: { calories: "380 kcal", carbs: "36g", protein: "6g" },
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80"
    }
];

const restaurants = [
    { id: 101, name: "Bella Napoli", cuisine: "Italian", rating: 4.9, price: "$$", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80" },
    { id: 102, name: "The Burger Hub", cuisine: "American", rating: 4.6, price: "$", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80" },
    { id: 103, name: "Tokyo Zen Grill", cuisine: "Japanese", rating: 4.8, price: "$$$", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80" },
    { id: 104, name: "Cantina Sol", cuisine: "Mexican", rating: 4.5, price: "$", image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=500&q=80" }
];

const categories = ["All", "Pizza", "Burgers", "Bowls", "Tacos", "Desserts"];

let cart = JSON.parse(localStorage.getItem('freshbite_cart')) || [];
let discountRate = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderFeaturedDishes();
    renderRestaurants(restaurants);
    renderMenu(foodItems);
    updateCartUI();
    checkAuthSession();

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('product-modal');
        if (e.target === modal) {
            closeProductModal();
        }
    });
});

function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <div class="category-badge" onclick="filterMenuByCategory('${cat}')">${cat}</div>
    `).join('');
}

function renderFeaturedDishes() {
    const container = document.getElementById('featured-dishes');
    if (!container) return;
    const featured = foodItems.filter(item => item.featured);
    container.innerHTML = featured.map(item => createDishCard(item)).join('');
}

function renderRestaurants(list) {
    const container = document.getElementById('restaurant-grid');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-muted);">No restaurants match your selected filters.</p>`;
        return;
    }

    container.innerHTML = list.map(r => `
        <div class="card">
            <img src="${r.image}" class="card-img" alt="${r.name}">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 class="card-title">${r.name}</h3>
                    <span style="font-weight: 700; color: #E65100;">★ ${r.rating}</span>
                </div>
                <p class="card-desc">${r.cuisine} Cuisine • Price: ${r.price}</p>
                <a href="#menu" class="btn btn-secondary text-center">View Menu</a>
            </div>
        </div>
    `).join('');
}

function renderMenu(list) {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-muted);">No items match the selected filter.</p>`;
        return;
    }

    container.innerHTML = list.map(item => createDishCard(item)).join('');
}

function createDishCard(item) {
    const tagClass = item.tag === 'Veg' ? 'badge-veg' : (item.tag === 'Non-Veg' ? 'badge-non-veg' : 'badge-gluten-free');
    return `
        <div class="card">
            <img src="${item.image}" class="card-img" alt="${item.name}">
            <div class="card-body">
                <span class="badge ${tagClass}">${item.tag}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.description}</p>
                <div class="card-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <div style="display: flex; gap: 0.4rem;">
                        <button class="btn btn-secondary" title="View Details" onclick="openProductModal(${item.id})"><i class="fas fa-info-circle"></i></button>
                        <button class="btn btn-primary" onclick="addToCart(${item.id})">Add +</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function filterRestaurants() {
    const cuisine = document.getElementById('filter-cuisine').value;
    const price = document.getElementById('filter-price').value;
    const rating = parseFloat(document.getElementById('filter-rating').value);

    const filtered = restaurants.filter(r => {
        const matchCuisine = (cuisine === "All" || r.cuisine === cuisine);
        const matchPrice = (price === "All" || r.price === price);
        const matchRating = (r.rating >= rating);
        return matchCuisine && matchPrice && matchRating;
    });

    renderRestaurants(filtered);
}

function filterMenu(tag, btn) {
    if (btn) {
        document.querySelectorAll('.dietary-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const filtered = tag === 'All' ? foodItems : foodItems.filter(item => item.tag === tag);
    renderMenu(filtered);
}

function filterMenuByCategory(category) {
    window.location.hash = "#menu";
    const filtered = category === 'All' 
        ? foodItems 
        : foodItems.filter(item => item.category.toLowerCase().startsWith(category.toLowerCase().slice(0, 4)));
    renderMenu(filtered);
}

function addToCart(itemId) {
    const item = foodItems.find(f => f.id === itemId);
    if (!item) return;

    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
}

function adjustQuantity(itemId, delta) {
    const itemIndex = cart.findIndex(c => c.id === itemId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('freshbite_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalCountEls = document.querySelectorAll('.cart-count');

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });

    totalCountEls.forEach(el => el.textContent = totalItems);

    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: var(--gray-muted);">Your shopping basket is currently empty.</p>`;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <h4 style="margin-bottom: 0.2rem;">${item.name}</h4>
                        <span style="color: var(--primary); font-weight: 700;">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="adjustQuantity(${item.id}, -1)">-</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="adjustQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    const deliveryFee = subtotal > 30 || subtotal === 0 ? 0.00 : 4.99;
    const discountAmount = subtotal * discountRate;
    const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

    const subtotalEl = document.getElementById('summary-subtotal');
    const deliveryEl = document.getElementById('summary-delivery');
    const discountEl = document.getElementById('summary-discount');
    const totalEl = document.getElementById('summary-total');
    const checkoutSummaryEl = document.getElementById('checkout-total-box');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = `$${deliveryFee.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;

    if (checkoutSummaryEl) {
        checkoutSummaryEl.innerHTML = `
            <div class="summary-line"><span>Items Selected (${totalItems}):</span><strong>$${subtotal.toFixed(2)}</strong></div>
            <div class="summary-line"><span>Delivery Fee:</span><strong>$${deliveryFee.toFixed(2)}</strong></div>
            <div class="summary-line"><span>Discount Applied:</span><strong>-$${discountAmount.toFixed(2)}</strong></div>
            <div class="summary-line total-line"><span>Final Total:</span><strong class="price">$${finalTotal.toFixed(2)}</strong></div>
        `;
    }
}

function applyPromo() {
    const promoInput = document.getElementById('promo-input');
    if (!promoInput) return;
    const code = promoInput.value.trim().toUpperCase();

    if (code === "FRESH50") {
        discountRate = 0.5;
        alert("Coupon Applied: 50% discount added to your subtotal!");
    } else {
        alert("Invalid coupon code. Try entering FRESH50");
    }
    updateCartUI();
}

function openProductModal(itemId) {
    const item = foodItems.find(f => f.id === itemId);
    if (!item) return;

    const modal = document.getElementById('product-modal');
    const details = document.getElementById('modal-details');

    if (!modal || !details) return;

    details.innerHTML = `
        <img src="${item.image}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;" alt="${item.name}">
        <h2 style="margin: 1rem 0 0.4rem;">${item.name}</h2>
        <p style="color: var(--gray-muted);">${item.description}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--gray-light);">
        <h4 style="margin-bottom: 0.3rem;">Ingredients:</h4>
        <p style="margin-bottom: 0.8rem;">${item.ingredients.join(', ')}</p>
        <h4 style="margin-bottom: 0.3rem;">Nutritional Info:</h4>
        <p>Calories: ${item.nutrition.calories} | Carbs: ${item.nutrition.carbs} | Protein: ${item.nutrition.protein}</p>
        <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <span class="price">$${item.price.toFixed(2)}</span>
            <button class="btn btn-primary" onclick="addToCart(${item.id}); closeProductModal();">Add To Basket</button>
        </div>
    `;
    modal.style.display = "flex";
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = "none";
}

function switchAuthTab(tab, btn) {
    const authPanel = document.getElementById('auth-panel');
    if (!authPanel) return;

    authPanel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passInput = document.getElementById('reg-password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!name || !email || !password) {
        alert("Please fill in all registration fields.");
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('freshbite_registered_users')) || [];

    const userExists = registeredUsers.some(u => u.email === email);
    if (userExists) {
        alert("An account with this email address already exists. Please log in.");
        return;
    }


    const newUser = { id: Date.now(), name, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem('freshbite_registered_users', JSON.stringify(registeredUsers));

    localStorage.setItem('freshbite_current_user', JSON.stringify({ name: newUser.name, email: newUser.email }));

    nameInput.value = '';
    emailInput.value = '';
    passInput.value = '';

    alert(`Account created successfully! Welcome, ${newUser.name}!`);
    checkAuthSession();
}


function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');

    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    const registeredUsers = JSON.parse(localStorage.getItem('freshbite_registered_users')) || [];

    const matchedUser = registeredUsers.find(u => u.email === email);
    if (!matchedUser) {
        alert("Access Denied: No registered account found with this email. Please register first.");
        return;
    }

  
    if (matchedUser.password !== password) {
        alert("Incorrect password. Please verify your credentials and try again.");
        return;
    }


    localStorage.setItem('freshbite_current_user', JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));

    emailInput.value = '';
    passInput.value = '';

    alert(`Welcome back, ${matchedUser.name}!`);
    checkAuthSession();
}

function handleLogout() {
    localStorage.removeItem('freshbite_current_user');
    checkAuthSession();

    const loginTab = document.querySelector('#auth-panel .tab-btn');
    switchAuthTab('login', loginTab);
}

function checkAuthSession() {
    const currentUser = JSON.parse(localStorage.getItem('freshbite_current_user'));
    const authPanel = document.getElementById('auth-panel');
    const profilePanel = document.getElementById('profile-panel');
    const navAccountLink = document.getElementById('nav-account-link');

    if (!authPanel || !profilePanel) return;

    if (currentUser) {
        authPanel.classList.add('hidden');
        profilePanel.classList.remove('hidden');

        document.getElementById('user-display-name').textContent = `Hello, ${currentUser.name}!`;
        document.getElementById('user-display-email').textContent = currentUser.email;

        const custName = document.getElementById('cust-name');
        if (custName && !custName.value) custName.value = currentUser.name;

        if (navAccountLink) {
            navAccountLink.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name}`;
        }

        renderUserOrderHistory(currentUser.email);
    } else {
        authPanel.classList.remove('hidden');
        profilePanel.classList.add('hidden');

        if (navAccountLink) {
            navAccountLink.innerHTML = `<i class="fas fa-user"></i> Account`;
        }
    }
}


function handlePlaceOrder(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('freshbite_current_user'));
    if (!currentUser) {
        alert("You must be registered and logged in to place an order. Please log in or create an account.");
        window.location.hash = "#account";
        return;
    }

    if (cart.length === 0) {
        alert("Your basket is empty. Please add food before placing an order.");
        return;
    }

    const orderData = {
        id: "FB-" + Math.floor(100000 + Math.random() * 900000),
        userEmail: currentUser.email, 
        name: document.getElementById('cust-name').value,
        address: document.getElementById('cust-address').value,
        phone: document.getElementById('cust-phone').value,
        time: document.getElementById('cust-time').value,
        payment: document.getElementById('cust-payment').value,
        total: document.getElementById('summary-total') ? document.getElementById('summary-total').textContent : "$0.00",
        itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        date: new Date().toLocaleDateString()
    };

    const allOrders = JSON.parse(localStorage.getItem('freshbite_orders')) || [];
    allOrders.unshift(orderData);
    localStorage.setItem('freshbite_orders', JSON.stringify(allOrders));

    cart = [];
    discountRate = 0;
    saveCart();
    updateCartUI();

    const promoInput = document.getElementById('promo-input');
    if (promoInput) promoInput.value = '';

    alert(`Order Confirmed!\nOrder Reference: ${orderData.id}\nDelivery Window: ${orderData.time}`);
    window.location.hash = "#account";
    checkAuthSession();
}

function renderUserOrderHistory(userEmail) {
    const allOrders = JSON.parse(localStorage.getItem('freshbite_orders')) || [];
    const userOrders = allOrders.filter(o => o.userEmail === userEmail);
    const container = document.getElementById('order-history-list');
    if (!container) return;

    if (userOrders.length === 0) {
        container.innerHTML = `<p style="color: var(--gray-muted); padding: 1rem 0;">You haven't placed any orders yet.</p>`;
        return;
    }

    container.innerHTML = userOrders.map(o => `
        <div style="background: var(--bg-cream); padding: 1.2rem; border-radius: 8px; margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid var(--primary); box-shadow: var(--shadow);">
            <div>
                <strong>${o.id}</strong> • <span style="font-size:0.85rem; color:#666;">${o.date}</span>
                <p style="font-size: 0.9rem; margin-top: 0.3rem;"><strong>Address:</strong> ${o.address}</p>
                <p style="font-size: 0.85rem; color:#888;"><strong>Items:</strong> ${o.itemsCount} | <strong>Window:</strong> ${o.time}</p>
            </div>
            <div style="text-align: right;">
                <strong style="color: var(--primary); font-size: 1.15rem;">${o.total}</strong>
                <p style="font-size: 0.8rem; color: #2E7D32; font-weight: 700; margin-top: 0.2rem;">Confirmed</p>
            </div>
        </div>
    `).join('');
}
