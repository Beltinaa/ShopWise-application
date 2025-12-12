const API_URL = "http://localhost:8080/api";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const productsContainer = document.getElementById("productsContainer");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const priceList = document.getElementById("priceList");

// DEMO PRODUCTS
const demoProducts = [
    {
        id: 1,
        name: "iPhone 14",
        price: 899,
        imageUrl: "https://example.com/iphone.jpg",
        description: "Apple smartphone 128GB",
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 799,
        imageUrl: "https://example.com/s23.jpg",
        description: "Samsung smartphone 256GB"
    },
    {
        id: 3,
        name: "MacBook Air M2",
        price: 1199,
        imageUrl: "https://example.com/macbook.jpg",
        description: "Apple laptop M2 chip"
    }
];

window.onload = () => loadProducts("");

// SEARCH
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    loadProducts(query);
});

// LOAD PRODUCTS (backend + fallback)
async function loadProducts(query) {
    productsContainer.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`${API_URL}/products?search=${query}`);

        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
            return;
        }

        displayProducts(demoProducts);

    } catch (error) {
        console.error("API Error:", error);
        displayProducts(demoProducts);
    }
}

// DISPLAY PRODUCTS
function displayProducts(products) {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${p.imageUrl || 'https://via.placeholder.com/200'}" alt="product">
            <h3>${p.name}</h3>
            <p>Best Price: <strong>${p.price} €</strong></p>
            <button onclick="openProduct(${p.id})">View Details</button>
        `;

        productsContainer.appendChild(card);
    });
}

// PRODUCT MODAL
async function openProduct(id) {
    modal.style.display = "flex";

    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const product = await response.json();

        modalName.innerHTML = product.name;
        modalDescription.innerHTML = product.description;

        const priceResponse = await fetch(`${API_URL}/products/${id}/compare`);
        const prices = await priceResponse.json();

        priceList.innerHTML = "";
        prices.forEach(p => {
            priceList.innerHTML += `<p><strong>${p.retailer}</strong> — ${p.price} €</p>`;
        });

    } catch (err) {
        modalName.innerHTML = "Demo Product";
        modalDescription.innerHTML = "Backend not available.";
        priceList.innerHTML = "<p>No price comparison available.</p>";
    }
}

// CLOSE PRODUCT MODAL
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

/* ===========================
   LOGIN / REGISTER APP-STYLE
============================ */
const loginBtnApp = document.getElementById('loginBtn');
const authAppModal = document.getElementById('authAppModal');
const closeAuthAppModal = document.getElementById('closeAuthAppModal');

// Open/Close modal
loginBtnApp.onclick = () => authAppModal.style.display = 'flex';
closeAuthAppModal.onclick = () => authAppModal.style.display = 'none';
window.addEventListener('click', (e) => { if (e.target === authAppModal) authAppModal.style.display = 'none'; });

// Tabs
function switchAuthTab(evt, tabId) {
    const tabs = document.getElementsByClassName('auth-tab-content');
    for (let t of tabs) t.style.display = 'none';
    const tabButtons = document.getElementsByClassName('auth-tab');
    for (let b of tabButtons) b.classList.remove('active');
    document.getElementById(tabId).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

// AJAX Login/Register
const backendUrl = "../backend/auth.php";

document.getElementById('loginFormApp').addEventListener('submit', async function(e){
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('login', true);
    const res = await fetch(backendUrl, { method:'POST', body:formData });
    const text = await res.text();
    document.getElementById('loginMsgApp').innerText = text;
});

document.getElementById('registerFormApp').addEventListener('submit', async function(e){
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('register', true);
    const res = await fetch(backendUrl, { method:'POST', body:formData });
    const text = await res.text();
    document.getElementById('registerMsgApp').innerText = text;
});
