document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartPanel = document.getElementById("cart-panel");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const searchBar = document.getElementById("search-bar");

    let cartData = JSON.parse(localStorage.getItem("cart")) || [];

    const products = [
        { id: 1, name: "Mobile Phone", price: 500 },
        { id: 2, name: "Laptop", price: 1500 },
        { id: 3, name: "Tablet", price: 700 }
    ];

    // Function to update cart UI
    const updateCart = () => {
        cartItems.innerHTML = "";
        let total = 0;
        let totalCount = 0;
        
        cartData.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                ${item.name} - $${item.price} x 
                <button class="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-id="${item.id}">+</button>
                <button class="remove" data-id="${item.id}">🗑</button>
            `;
            cartItems.appendChild(div);
            total += item.price * item.quantity;
            totalCount += item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = totalCount;
        localStorage.setItem("cart", JSON.stringify(cartData));
    };

    // Render products
    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <input type="number" min="1" value="1" class="quantity" data-id="${product.id}">
            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        productList.appendChild(div);
    });

    // Add to cart
    productList.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const id = parseInt(event.target.dataset.id);
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);
            const quantityInput = event.target.previousElementSibling;
            const quantity = parseInt(quantityInput.value);
            
            const existingItem = cartData.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartData.push({ id, name, price, quantity });
            }
            updateCart();
        }
    });

    // Cart actions
    cartItems.addEventListener("click", (event) => {
        const id = parseInt(event.target.dataset.id);
        const item = cartData.find(item => item.id === id);
        
        if (!item) return;

        if (event.target.classList.contains("increase")) {
            item.quantity++;
        } else if (event.target.classList.contains("decrease")) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartData = cartData.filter(i => i.id !== id);
            }
        } else if (event.target.classList.contains("remove")) {
            cartData = cartData.filter(i => i.id !== id);
        }
        updateCart();
    });

    // Toggle Cart Panel
    window.toggleCart = () => {
        cartPanel.classList.toggle("cart-open");
    };

    // Clear Cart
    window.clearCart = () => {
        cartData = [];
        updateCart();
    };

    // Checkout Action
    window.checkout = () => {
        if (cartData.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Thank you for your purchase!");
        cartData = [];
        updateCart();
    };

    // Load cart from localStorage
    updateCart();
});
