//Change navBar background on scroll
window.onscroll = function () {
    var navMobile = document.getElementById('nav-mobile');
    var scroll = window.scrollY;
    if (scroll > 50) {
        navMobile.style.backgroundColor = 'black';
        navMobile.style.transition = 'ease-in 0.5s';
    } else {
        navMobile.style.backgroundColor = 'transparent';
    }
}

// Se crea la clase Producto
class Products {
    constructor(id, title, price, category, description, image) {
        this.id = id
        this.title = title
        this.price = price
        this.category = category
        this.description = description
        this.image = image
        this.quantity = 1
    }
}

class Cart {
    constructor() {
        this.cartList = []
    }

    addToCartList(productToAdd) {

        let productExist = this.cartList.some(product => product.id == productToAdd.id)

        if (productExist) {

            let product = this.cartList.find(producto => producto.id == productToAdd.id)
            product.quantity = product.quantity + 1

        } else {
            this.cartList.push(productToAdd)
        }

    }

    removeFromCartList(productRemove) {
        let product = this.cartList.find(product => product.id === productRemove.id)
        let index = this.cartList.indexOf(product)
        this.cartList.splice(index, 1)
    }

    setLocalStorage() {
        let cartListJSON = JSON.stringify(this.cartList)
        localStorage.setItem('CartList', cartListJSON)
    }

    getLocalStorage() {
        let cartListJSON = localStorage.getItem('CartList');
        this.cartList = JSON.parse(cartListJSON) || [];
    }

    removeLocalStorage() {
        localStorage.removeItem('CartList')
    }

    checkout() {
        let checkout = document.getElementById('checkout')
        checkout.addEventListener('click', () => {

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tu compra se ha realizado con éxito',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    title: 'checkout-title',
                }
            })

            this.removeLocalStorage()
            checkout.disabled = true
        })
    }

    showCartOnDom() {

        if (cart.cartList != "") {

            let subTotalPrice = 0
            let ivaPrice = 0

            let cart = document.getElementById('cart-custom')
            cart.innerHTML = '';

            this.cartList.forEach(product => {

                let productPrice = product.price * product.quantity
                cart.innerHTML += `
                <div class="col-auto">
                    <div class="media flex-column flex-sm-row">
                        <img class="img-fluid mb-2" src="${product.image}" width="62" height="62">
                        <div class="media-body my-auto">
                            <div class="row">
                                <div class="col-auto">
                                  <p class="mb-0"> <b>${product.title}</b> </p><small class="text-muted"> ${product.description} </small>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="d-inline">
                  <input id="input-${product.id}" class="quantity-input" min="1" max="10" type="number" value="${product.quantity}">
                </div>
                <div class="pl-0 flex-sm-col col-auto  my-auto">
                  <p class="price"><b>Precio:$${productPrice}</b></p>
                  <a id="${product.id}" class="remove-btn">Eliminar Producto</a>
                </div>
                <hr>`


                // Generar Total Y mostrarlo en el DOM

                subTotalPrice = productPrice + subTotalPrice
                let subTotal = document.getElementById('subtotal')
                subTotal.innerHTML = `<p class="mb-1">${subTotalPrice}</p>`

                ivaPrice = Math.round(subTotalPrice * 0.21)
                let iva = document.getElementById('iva')
                iva.innerHTML = `<p>${ivaPrice}</p>`

                let totalPrice = Math.round(ivaPrice + subTotalPrice)
                let total = document.getElementById('total')
                total.innerHTML = `<p class="mb-1"><b>${totalPrice}</b></p>`

                let checkout = document.getElementById('checkout')
                checkout.innerHTML = `Pagar : $ ${totalPrice}`
                checkout.disabled = false

            });

            // Event Listener para borrar producto del Carrito

            this.cartList.forEach(product => {

                let btnRemove = document.getElementById(`${product.id}`)
                btnRemove.addEventListener("click", () => {

                    this.removeFromCartList(product)
                    this.setLocalStorage()
                    this.showCartOnDom()

                    Toastify({

                        text: `${product.title} eliminado del carrito!`,
                        duration: 2000,
                        gravity: "bottom",
                        position: "right",
                        style: {
                            background: "linear-gradient(117.8deg, rgb(240, 19, 77) 22.2%, rgb(228, 0, 124) 88.7%)",
                        },

                    }).showToast();

                })

            });

            // Agregar evento input al input number para actualizar la cantidad

            this.cartList.forEach(product => {

                let quantityInput = document.getElementById(`input-${product.id}`)
                quantityInput.addEventListener('input', event => {
                    let newQuantity = parseInt(event.target.value);
                    product.quantity = newQuantity;
                    console.log(newQuantity)

                    if (isNaN(newQuantity) || newQuantity === 0) {

                        Toastify({
                            text: `0 no es un número válido!`,
                            duration: 2000,
                            gravity: "bottom",
                            position: "right",
                            style: {
                                background: "linear-gradient(117.8deg, rgb(240, 19, 77) 22.2%, rgb(228, 0, 124) 88.7%)",
                            },

                        }).showToast();
   
                        product.quantity = 1
                        this.setLocalStorage();
                        this.showCartOnDom()

                        let checkout = document.getElementById('checkout')
                        checkout.disabled = true

                    } else if (newQuantity > 10) {

                        Toastify({
                            text: ` ${newQuantity} unidades supera el stock de este producto.`,
                            duration: 2000,
                            gravity: "bottom",
                            position: "right",
                            style: {
                                background: "linear-gradient(117.8deg, rgb(240, 19, 77) 22.2%, rgb(228, 0, 124) 88.7%)",
                            },

                        }).showToast();

                        this.setLocalStorage();
                        this.showCartOnDom()
                        checkout.disabled = true

                        
                    } else {
                        this.setLocalStorage();
                        this.showCartOnDom();
                    }



                });

            });

        } else {
            let cart = document.getElementById('cart-custom')
            cart.innerHTML = `<p>No tienes productos en tu carrito</p>`;

            let subTotal = document.getElementById('subtotal')
            subTotal.innerHTML = `<p class="mb-1"><b>0</b></p>`

            let iva = document.getElementById('iva')
            iva.innerHTML = `<p class="mb-1"><b>0</b></p>`

            let total = document.getElementById('total')
            total.innerHTML = `<p class="mb-1"><b>0</b></p>`

            let checkout = document.getElementById('checkout')
            checkout.innerHTML = `Pagar: 0`
            checkout.disabled = true
        }


    }

    showProductNumber() {

        let productQuantity = this.cartList.length
        let cartquantity = document.getElementById('cart-quantity')
        cartquantity.innerText = `${productQuantity}`
    }

}

class ProductController {
    constructor() {
        this.productList = []
    }

    addToProductList(product) {
        this.productList.push(product)
    }

    showProductsOnDom() {

        let wineCard = document.getElementById('wine-card')
        this.productList.forEach(product => {

            wineCard.innerHTML +=
                `<div class="card p-4">
         <img class="card-img" src="${product.image}" alt="">
         <h3 class="card-title">
             ${product.title}
         </h3>
         <p class="card-text">
            ${product.description}
         </p>
         <p class="card-price">
             $ ${product.price}
         </p>
         <button id="${product.id}" class="btn-primary">Agregar al Carrito </button>
         </div>`


        });
    }

    AddToCartEventListener() {

        productController.productList.forEach(product => {

            let addToCartBtn = document.getElementById(`${product.id}`)

            addToCartBtn.addEventListener('click', () => {
                cart.addToCartList(product)
                cart.showProductNumber()
                cart.setLocalStorage()
                cart.showCartOnDom()

                Toastify({

                    text: `"${product.title}" agregado al carrito`,
                    duration: 2000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },

                }).showToast();

            })

        });
    }
}


const product = new Products()
const productController = new ProductController()
const cart = new Cart()


fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
        // Agregar los productos obtenidos del fetch a la lista de productos
        json.forEach(productData => {
            const newProduct = new Products(
                productData.id,
                productData.title,
                productData.price,
                productData.category,
                productData.description,
                productData.image,
            );
            productController.addToProductList(newProduct);
        });

        // Mostrar los Productos en el DOM
        productController.showProductsOnDom();
        // Agregar producto elegido a la Lista Carrito y Mostrarla en el Dom de Carrito
        productController.AddToCartEventListener();
    });


cart.getLocalStorage()
cart.showCartOnDom()
cart.showProductNumber()

// Mensaje de confirmación al pagar
cart.checkout()

// Footer Date 
const date = new Date();
let year = document.getElementById('year')
year.innerHTML = date.getFullYear()