import products from "./products.js";

const cart = () => {
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cartFooter = document.querySelector('.cart-footer');
    let cart = [];
    
    // Open and close cart sidebar
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    
    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        if (body.classList.contains('activeTabCart') && 
            !e.target.closest('.cartTab') && 
            !e.target.closest('.icon-cart')) {
            body.classList.remove('activeTabCart');
        }
    });
    
    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        if(value <= 0){
            cart.splice(positionThisProductInCart, 1);
        }else if(positionThisProductInCart < 0){
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        }else{
            cart[positionThisProductInCart].quantity = value;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        addCartToHTML();
    }
    
    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        
        if(cart.length > 0){
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
    
                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                
                // Calculate item total
                let itemTotal = info.price * item.quantity;
                totalPrice += itemTotal;
                
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="${info.name}">
                    </div>
                    <div class="info">
                        <div class="name">${info.name}</div>
                        <div class="price">₱${info.price.toFixed(2)}</div>
                        <div class="quantity">
                            <span class="minus" data-id="${info.id}">-</span>
                            <span class="count">${item.quantity}</span>
                            <span class="plus" data-id="${info.id}">+</span>
                        </div>
                    </div>
                `;
                
                listCartHTML.appendChild(newItem);
            });
            
            // Update cart footer with total
            cartFooter.innerHTML = `
                <div class="cart-total">
                    <span>Total:</span>
                    <span>₱${totalPrice.toFixed(2)}</span>
                </div>
                <div class="checkout-btn">
                    <button>Checkout</button>
                </div>
            `;
            cartFooter.style.display = 'block';
        } else {
            // Show empty cart message
            listCartHTML.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartFooter.style.display = 'none';
        }
        
        iconCartSpan.innerText = totalQuantity;
    }
    
    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        
        if (idProduct) {
            let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
            
            switch (true) {
                case (buttonClick.classList.contains('add-to-cart')):
                    // Show a small animation when adding to cart
                    buttonClick.classList.add('adding');
                    setTimeout(() => {
                        buttonClick.classList.remove('adding');
                    }, 500);
                    
                    quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity + 1;
                    setProductInCart(idProduct, quantity);
                    
                    // Open cart when adding an item
                    body.classList.add('activeTabCart');
                    break;
                    
                case (buttonClick.classList.contains('minus')):
                    quantity = cart[positionProductInCart].quantity - 1;
                    setProductInCart(idProduct, quantity);
                    break;
                    
                case (buttonClick.classList.contains('plus')):
                    quantity = cart[positionProductInCart].quantity + 1;
                    setProductInCart(idProduct, quantity);
                    break;
                    
                default:
                    break;
            }
        }
    });
    
    const initApp = () => {
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        } else {
            addCartToHTML(); // Initialize empty cart display
        }
    }
    
    initApp();
}

export default cart;
         
             
           
                   
