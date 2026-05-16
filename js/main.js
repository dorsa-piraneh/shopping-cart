/* ========================================================================================
                                     DOM ELEMENTS
======================================================================================== */
const productsContainer = document.querySelector('.products-container');
const noResults = document.querySelector('.no-results-container');
const serachInput = document.querySelector('#serachInput');
const openCartBtn = document.querySelector('#openCartBtn');
const cartBox = document.querySelector('.cart-box');
const cartHeader = document.querySelector('.cart-header');
const cartFooter = document.querySelector('.cart-footer');
const cartBody = document.querySelector('.cart-body');
const totalCount = document.querySelectorAll('.total-count');
const totalCartPriceElement = document.querySelector('.total-cart-price');
const clearAllBtn = document.querySelector('.clear-all-btn');
const bannerImage = document.querySelector('.banner-image');
/* ========================================================================================
                                     INITIAL STATE
======================================================================================== */

let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

/* ========================================================================================
                                      FUNCTIONS
======================================================================================== */
const renderProducts = (displayedProducts) => {
  productsContainer.innerHTML = '';
  displayedProducts.forEach((product) => {
    const { id, titleFa, titleEn, category, imageSrc, price, discount, stock, rating } = product;
    productsContainer.insertAdjacentHTML(
      'beforeend',
      `
         <article class="product-card" data-id=${id}>
            <img src=${imageSrc} class="product-image" alt=${titleEn} />
            <p class="product-category">${category}</p>
            <h2 class="product-title">${titleFa}</h2>

            <div class="product-info">
              <div class="product-stock ${!(stock === 1 || stock === 2) && 'invisible'}">
                <i class="fa fa-regular fa-box"></i>
                <p class="stock-text"><span class="stock-count">${stock}</span> عدد در انبار باقی مانده</p>
              </div>

              <div class="product-rating">
                <i class="fa fa-solid fa-star rating-icon"></i>
                <span class="rating-value">${rating}</span>
              </div>
            </div>

            <div class="pricing-section">
              <div class="product-discount ${!discount && 'invisible'}">
                <i class="fa fa-solid fa-percent"></i>
                <span class="">${discount}</span>
              </div>

              <div class="product-price">
                <div class="after-discount-price">
                  <p>${(price - (discount / 100) * price).toLocaleString()}</p>
                  <span>تومان</span>
                </div>

                <div class="before-discount-price ${!discount && 'invisible'}">
                  <p>${price.toLocaleString()}</p>
                  <span>تومان</span>
                </div>
              </div>
            </div>

            <button type="button" class="add-to-cart" onclick="addToCart(${id} , event)">افزودن به سبد خرید</button>
          </article>

         `,
    );
  });
};

const searchProduct = () => {
  const searchedValue = serachInput.value.toLowerCase().trim();

  const filteredProducts = products.filter((product) => {
    return product['title-fa'].includes(searchedValue) || product['title-en'].toLowerCase().includes(searchedValue);
  });

  renderProducts(filteredProducts);

  if (filteredProducts.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }
};

const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartProducts));
};

const renderCartProducts = () => {
  cartBody.innerHTML = '';
  if (cartProducts.length === 0) {
    cartHeader.classList.add('hidden');
    cartFooter.classList.add('hidden');

    cartBody.innerHTML = ` <div class="empty-cart">
              <img src="./assets/images/empty-cart.svg" alt="empty-cart" />
              <p>سبد خرید شما خالی است!</p>
            </div>
            `;
  } else {
    cartHeader.classList.remove('hidden');
    cartFooter.classList.remove('hidden');
    cartProducts.forEach((product) => {
      const { id, titleFa, titleEn, imageSrc, price, discount, count, orderLimit } = product;
      cartBody.insertAdjacentHTML(
        'beforeend',
        `
      <article class="cart-item">
          <div class="cart-item-details">
            <div class="cart-item-info">
              <h2 class="cart-item-title">${titleFa}</h2>

              <div class="item-price">
                <div class="before-discount-price ${!discount && 'invisible'}">
                  <p>${price.toLocaleString('fa-IR')}</p>
                  <span>تومان</span>
                </div>

                <div class="after-discount-price">
                  <p>${(price - (discount / 100) * price).toLocaleString()}</p>
                  <span>تومان</span>
                </div>
              </div>
            </div>
            <div class="cart-item-image">
              <img src=${imageSrc} alt=${titleEn} />
            </div>
          </div>

          <div class="quantity-controls">
            <button type="button" class="quantity-button increase-quantity" ${count == orderLimit && 'disabled'} onclick="incrementProductQuantity(${id} , event)">
              <i class="fa-solid fa-plus"></i>
            </button>
            <span class="quantity-value">${count}</span>

              <button type="button" class="quantity-button remove-product ${count > 1 && 'hidden'}" onclick="removeProductFromCart(${id} , event)">
                <i class="fa-regular fa-trash"></i>
              </button>

               <button type="button" class="quantity-button decrease-quantity ${count == 1 && 'hidden'}" onclick="decrementProductQuantity(${id} , event)">
                <i class="fa-solid fa-minus"></i>
              </button>
          </div>
      </article>
            `,
      );
    });
  }

  const cartTotalCount = cartProducts.reduce((acc, curr) => {
    return acc + curr.count;
  }, 0);
  totalCount.forEach((item) => (item.innerHTML = cartTotalCount));
};

const calculateTotalPrice = () => {
  const totalCartPrice = cartProducts.reduce((acc, curr) => {
    return acc + curr.count * (curr.price - (curr.discount / 100) * curr.price);
  }, 0);
  totalCartPriceElement.innerHTML = totalCartPrice.toLocaleString();
};

const updateCart = () => {
  saveCartToLocalStorage();
  renderCartProducts();
  calculateTotalPrice();
};

const showSuccessAlert = (title, textMessage) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: textMessage,
    iconColor: 'transparent',
    showConfirmButton: true,
    confirmButtonText: 'مشاهده سبد خرید',
    showCancelButton: true,
    cancelButtonText: 'بستن',
    showCloseButton: true,
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup',
      title: 'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn',
      closeButton: 'swal-close-btn',
      icon: 'swal-success-icon',
      actions: 'swal-actions-wrapper',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => {
        cartBox.classList.remove('invisible');
      }, 100);
    }
  });
};

const showErrorAlert = (title, textMessage) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: textMessage,
    showConfirmButton: true,
    confirmButtonText: 'مشاهده سبد خرید',
    showCancelButton: true,
    cancelButtonText: 'بستن',
    showCloseButton: true,
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup',
      title: 'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn',
      closeButton: 'swal-close-btn',
      icon: 'swal-error-icon',
      actions: 'swal-actions-wrapper',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => {
        cartBox.classList.remove('invisible');
      }, 100);
    }
  });
};

const addToCart = (productId, event) => {
  const isInCart = cartProducts.some((product) => product.id === productId);
  if (!isInCart) {
    const selectedProduct = products.find((product) => product.id === productId);
    const { id, titleFa, titleEn, imageSrc, price, discount, orderLimit } = selectedProduct;
    const newProduct = {
      id,
      titleFa,
      titleEn,
      imageSrc,
      price,
      discount,
      orderLimit,
      count: 1,
    };
    cartProducts.push(newProduct);
    // showSuccessAlert('اضافه شد', 'کالا با موفقیت به سبد خرید شما افزوده شد.');
  } else {
    const existingProduct = cartProducts.find((product) => product.id == productId);
    if (existingProduct.count < existingProduct.orderLimit) {
      existingProduct.count++;
      // showSuccessAlert('سبد خرید به‌روزرسانی شد', 'تعداد کالا در سبد خرید با موفقیت افزایش یافت.');
    } else {
      // showErrorAlert('محدودیت تعداد', `امکان خرید بیشتر از ${existingProduct.orderLimit} عدد از این کالا وجود ندارد.`);
    }
  }
  updateCart();
  event.stopPropagation();
};

const incrementProductQuantity = (productId, event) => {
  const foundProduct = cartProducts.find((product) => product.id == productId);
  foundProduct.count++;
  updateCart();
  event.stopPropagation();
};

const decrementProductQuantity = (productId, event) => {
  const foundProduct = cartProducts.find((product) => product.id == productId);
  foundProduct.count--;
  updateCart();
  event.stopPropagation();
};

const removeProductFromCart = (productId, event) => {
  const foundProductIndex = cartProducts.findIndex((product) => product.id == productId);
  cartProducts.splice(foundProductIndex, 1);
  updateCart();
  event.stopPropagation();
};

const clearCart = () => {
  cartProducts = [];
  updateCart();
};

/* ========================================================================================
                                      EVENT LISTENERS
======================================================================================== */

window.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  renderCartProducts();
  calculateTotalPrice();
});

serachInput.addEventListener('input', searchProduct);

openCartBtn.addEventListener('click', () => cartBox.classList.remove('invisible'));

// Close cart when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.cart-box') && !event.target.closest('.cart-icon-container')) {
    cartBox.classList.add('invisible');
  }
});

clearAllBtn.addEventListener('click', clearCart);

// Change banner image on resize page
window.addEventListener('resize', () => {
  if (window.innerWidth <= 576) {
    bannerImage.src = './assets/images/banner-for-mobile.webp';
  } else {
    bannerImage.src = './assets/images/banner.webp';
  }
});
