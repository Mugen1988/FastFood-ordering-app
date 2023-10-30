import menuArray from '/data.js';

const container = document.getElementById('container');
let orderContainer = document.getElementById('order-container');
let orders = [];
let orderQuantities = {};
const paymentPopup = document.getElementById('payment-popup');

//FUNCTION TO RENDER MENU CONTENT AND ADD TO CART BUTTONS
function getMenuHtml() {
    let menuItemHtml = ``
    menuArray.forEach(function(menuItem){
        menuItemHtml += `
        <div class="menu-item" data-id="${menuItem.id}">
            <div class="menu-image">
                <h1>${menuItem.emoji}</h1>
            </div>
            <div class="menu-info">
                <h3>${menuItem.name}</h3>
                <h4>${menuItem.ingredients}</h4>
                <h4>Price: ${menuItem.price}$</h4>
            </div>
            <button class="order-button" data-cart-button="${menuItem.id}">+</button>
        </div>`
        })
    return menuItemHtml     
}
// RENDERING MENU PART
document.getElementById('container').innerHTML = getMenuHtml();

//EVENT LISTENER FOR ADD TO CART BUTTONS
container.addEventListener('click', function(e) {
    // const target = e.target;
    const {target} = e;
    if(target.dataset.cartButton){
        addToCart(target.dataset.cartButton)
    }
});
    
//FUNCTION THAT COLLECTING DATA FROM OBJECT WITH SPECIFIC ID AND PASS IT INTO NEW OBJECT CALLED ORDERS AND RENDERING THE ORDERS PART
function addToCart(menuItemId) {
    const targetMenuObj = menuArray.find(menuItem => menuItem.id == menuItemId);

    if (targetMenuObj) {
        if (orderQuantities.hasOwnProperty(menuItemId)) {
            orderQuantities[menuItemId] += 1;
        } else {
            orderQuantities[menuItemId] = 1;
        }
        
        // Re-render the order container
        orderContainer.innerHTML = getOrderHtml();
    }
}
    
//FUNCTION TO RENDER THE ORDER WITH TOTAL PRICE AND REMOVE BUTTONS
function getOrderHtml() {
    let orderItemHtml = ``;
    let totalPrice = calculateTotalPrice();
    
    if (Object.keys(orderQuantities).length > 0) {
        // Add "Your Order" text at the beginning of orders-container
        orderItemHtml += `<h2>Your Order</h2>`;
    }

    // Loop through the keys in orderQuantities
    for (const menuItemId in orderQuantities) {
        if (orderQuantities.hasOwnProperty(menuItemId)) {
            const orderItem = menuArray.find(menuItem => menuItem.id == menuItemId);
            
            if (orderItem) {
                orderItemHtml += `
                <div class="order-item">
                    <div class="order-info">
                        <h3>${orderItem.name}</h3>
                        <button class="remove-button" data-remove="${orderItem.id}">Remove</button>
                        <p>${renderQuantity(menuItemId)}</p>
                    </div>
                    <h3>Price: ${orderItem.price}$</h3>
                </div>`;
            }
        }
    }
    //ADDING TOTAL PRICE AND COMPLETE ORDER BUTTON
    const totalAndCompleteButtonHtml = `
    <div class="total-price">
        <h3>Total Price:</h3>
        <h3>${totalPrice}</h3>
    </div>
    <button class="complete-order" id="complete-order" data-complete="complete-order">Complete Order</button>
    `
    // Append the total price and Complete Order button HTML at the end
    if(orderItemHtml){
        orderItemHtml += totalAndCompleteButtonHtml;
    }       
    return orderItemHtml;
}
//EVENT LISTENER FOR REMOVE BUTTON AND COMPLETE ORDER BUTTON
orderContainer.addEventListener('click', function(e) {
    const { target } = e;
    if (target.dataset.remove) {
        removeOrderItem(target.dataset.remove);
    }
    
    const closePopupButton = document.getElementById('close-popup');
    // Add an event listener to the "Complete Order" button
    if (target.dataset.complete) {
        paymentPopup.style.display = 'block';
    }
    //ADD an event listener to close button on popup
    closePopupButton.addEventListener('click', function(){
        paymentPopup.style.display = 'none';
    })
});
//FUNCTION TO REMOVE ITEMS FROM ORDER
function removeOrderItem(menuItemId) {
    if (orderQuantities.hasOwnProperty(menuItemId)) {
        if (orderQuantities[menuItemId] > 1) {
            orderQuantities[menuItemId] -= 1;
        } else {
            delete orderQuantities[menuItemId];
        }

        // Re-render the order container
        orderContainer.innerHTML = getOrderHtml();
    }
}
// Function to get the quantity for a menu item
function getQuantityForMenuItem(menuItemId) {
    return orderQuantities[menuItemId] || 0;
}

// Function to render the quantity in getOrderHtml
function renderQuantity(menuItemId) {
    const quantity = getQuantityForMenuItem(menuItemId);
    return quantity > 0 ? `x${quantity}` : '';
}

//FUNCTION TO CALCULATE TOTAL PRICE
function calculateTotalPrice() {
    let totalPrice = 0;

    for (const menuItemId in orderQuantities) {
        if (orderQuantities.hasOwnProperty(menuItemId)) {
            const orderItem = menuArray.find(menuItem => menuItem.id == menuItemId);

            if (orderItem) {
                totalPrice += orderItem.price * orderQuantities[menuItemId];
            }
        }
    }

    return `${totalPrice} $`;
}
// RENDERING ORDER PART
document.getElementById('order-container').innerHTML = getOrderHtml()

const payBtn = document.getElementById('pay-btn');
const orderCompleted = document.getElementById('order-completed');
const firstNameInput = document.getElementById('first-name');

payBtn.addEventListener('click', function(event){
    event.preventDefault(); // Prevent the default form submission behavior
    const firstName = firstNameInput.value;
    paymentPopup.style.display = 'none';
    orderContainer.innerHTML = `<h3>Order completed! Thank you, ${firstName}!</h3>`;
});