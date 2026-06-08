const CART_STORAGE_KEY = 'zonix_cart'

function isValidItem(item) {
  return item && item.id && typeof item.name === 'string' && typeof item.price === 'number' && !isNaN(item.price) && item.price > 0 && typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0
}

function getCart() {
  try {
    var raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
    if (!Array.isArray(raw)) return []
    return raw.filter(isValidItem)
  } catch (e) {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  document.dispatchEvent(new CustomEvent('cart:updated'))
}

function addToCart(product, quantity) {
  if (!quantity) quantity = 1
  var cart = getCart()
  var existing = cart.find(function (item) { return item.id === product.id })
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageurl: product.imageurl || null,
      category: product.category || '',
      quantity: quantity
    })
  }
  saveCart(cart)
}

function removeFromCart(productId) {
  var cart = getCart()
  cart = cart.filter(function (item) { return item.id !== productId })
  saveCart(cart)
}

function updateQuantity(productId, quantity) {
  if (quantity < 1) return removeFromCart(productId)
  var cart = getCart()
  var item = cart.find(function (item) { return item.id === productId })
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY)
  document.dispatchEvent(new CustomEvent('cart:updated'))
}

function getCartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.quantity }, 0)
}

function getCartTotal() {
  return getCart().reduce(function (sum, item) { return sum + item.price * item.quantity }, 0)
}

function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) return '$0'
  return '$' + Number(price).toLocaleString('es-AR')
}

function getDefaultImage() {
  return 'assets/images/thumbnail-default.webp'
}

function renderCartUI() {
  var cart = getCart()
  var count = getCartCount()
  var total = getCartTotal()

  var countBadge = document.querySelector('.carrito-count')
  if (countBadge) countBadge.textContent = count

  var dropdown = document.getElementById('carrito-dropdown')
  if (!dropdown) return

  var itemsContainer = dropdown.querySelector('.carrito-items')
  var totalSpan = dropdown.querySelector('.carrito-precio')
  var cantidadSpan = document.getElementById('carrito-cantidad')

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = '<p class="carrito-vacio" style="padding:1rem;text-align:center;color:var(--text-muted);">Tu carrito está vacío</p>'
    } else {
      itemsContainer.innerHTML = cart.map(function (item) {
        var imgSrc = item.imageurl || getDefaultImage()
        return '<div class="carrito-producto">' +
          '<img src="' + imgSrc + '" alt="' + item.name + '" onerror="this.src=\'' + getDefaultImage() + '\'">' +
          '<div class="carrito-producto-info">' +
            '<h4>' + item.name + '</h4>' +
            '<span class="carrito-producto-cantidad">' + item.quantity + ' x ' + formatPrice(item.price) + '</span>' +
          '</div>' +
        '</div>'
      }).join('')
    }
  }

  if (totalSpan) totalSpan.textContent = formatPrice(total)
  if (cantidadSpan) cantidadSpan.textContent = count
}

document.addEventListener('cart:updated', renderCartUI)

;(function () {
  var cart = getCart()
  saveCart(cart)
})()
