// window.addEventListener("load", (event) => {

//    let modal = document.getElementById("myModal")
//    modal.style.display = "block";
//    modal.style.opacity = "1";

// });


//Change navBar background on scroll
window.onscroll = function () {
    var navMobile = document.getElementById('nav-mobile');
    var scroll = window.scrollY;
    if (scroll > 200) {
        navMobile.style.backgroundColor = 'black';
        navMobile.style.transition = 'ease-in 0.5s';
    } else {
        navMobile.style.backgroundColor = 'transparent';
    }
}

// Se crea la clase Producto
class Products {
    constructor(id, name, price, description, img) {
        this.id = id
        this.name = name
        this.price = price
        this.description = description
        this.img = img
    }
}

class Cart {
    constructor() {
        this.cartList = []
    }

    addToCartList(product) {
        this.cartList.push(product)
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
                cart.innerHTML += `
            <div class="col-auto col-md-7">
                <div class="media flex-column flex-sm-row">
                    <img class="img-fluid" src="${product.img}" width="62" height="62">
                    <div class="media-body my-auto">
                        <div class="row">
                            <div class="col-auto">
                              <p class="mb-0"> <b>${product.name}</b> </p><small class="text-muted"> ${product.description} </small>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="pl-0 flex-sm-col col-auto my-auto">
              <input class="quantity-input" type="number" placeholder="2" value="1">
            </div>
            <div class="pl-0 flex-sm-col col-auto  my-auto">
              <p class="price"><b>Precio: $${product.price}</b></p>
              <a id="${product.id}" class="remove-btn">Eliminar Producto</a>
            </div>
            <hr>`

                // Generar Total Y mostrarlo en el DOM

                subTotalPrice = product.price + subTotalPrice
                let subTotal = document.getElementById('subtotal')
                subTotal.innerHTML = `<p class="mb-1">${subTotalPrice}</p>`

                ivaPrice = Math.round(subTotalPrice * 0.21)
                let iva = document.getElementById('iva')
                iva.innerHTML = `<p>${ivaPrice}</p>`

                let totalPrice = ivaPrice + subTotalPrice
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

                        text: `${product.name} eliminado del carrito!`,
                        duration: 2000,
                        gravity: "bottom",
                        position: "center",
                        style: {
                            background: "linear-gradient(117.8deg, rgb(240, 19, 77) 22.2%, rgb(228, 0, 124) 88.7%)",
                        },

                    }).showToast();

                })

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
         <img class="card-img" src="${product.img}" alt="">
         <h3 class="card-title">
             ${product.name}
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
                cart.setLocalStorage()
                cart.showCartOnDom()

                Toastify({

                    text: `"${product.name}" agregado al carrito`,
                    duration: 2000,
                    gravity: "bottom",
                    position: "center",
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

productController.addToProductList(new Products(0, 'San Valentin Garnacha 2006', 200, 'Red Wine, Spain', '/img/vinos/vino1.png'))
productController.addToProductList(new Products(1, 'Wardy Cabernet Sauvignon', 500, 'Red Wine, Chile', '/img/vinos/vino2.png'))
productController.addToProductList(new Products(2, 'San Valentin Garnacha 2005', 300, 'Red Wine, Spain', '/img/vinos/vino3.png'))
productController.addToProductList(new Products(3, 'Vino Yours 2013', 280, 'Red Blend, Uruguay', '/img/vinos/vino4.png'))


// Mostrar los Productos en el DOM
productController.showProductsOnDom()

// Agregar producto elegido a la Lista Carrito y Mostrarla en el Dom de Carrito
productController.AddToCartEventListener()
cart.getLocalStorage()
cart.showCartOnDom()
cart.checkout()