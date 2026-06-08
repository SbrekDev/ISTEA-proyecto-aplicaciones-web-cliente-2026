document.addEventListener('DOMContentLoaded', function () {
  var resumenContainer = document.querySelector('.checkout-resumen')
  if (!resumenContainer) return

  function render() {
    var cart = getCart()
    var count = getCartCount()
    var total = getCartTotal()

    if (cart.length === 0) {
      resumenContainer.innerHTML =
        '<h3>Resumen del Pedido</h3>' +
        '<p style="text-align:center;padding:1rem;color:var(--text-muted);">Tu carrito está vacío</p>' +
        '<a href="catalogo.html" class="btn-ver-detalle" style="display:block;text-align:center;">Ir al catálogo</a>'
      return
    }

    resumenContainer.innerHTML =
      '<h3>Resumen del Pedido</h3>' +
      '<div class="resumen-productos">' +
      cart.map(function (item) {
        var imgSrc = item.imageurl || getDefaultImage()
        return '' +
          '<div class="resumen-producto">' +
            '<img src="' + imgSrc + '" alt="' + item.name + '" onerror="this.src=\'' + getDefaultImage() + '\'">' +
            '<div class="resumen-producto-info">' +
              '<h4>' + item.name + '</h4>' +
              '<span>' + item.quantity + ' unidad' + (item.quantity > 1 ? 'es' : '') + '</span>' +
            '</div>' +
            '<span class="resumen-producto-precio">' + formatPrice(item.price * item.quantity) + '</span>' +
          '</div>'
      }).join('') +
      '</div>' +
      '<div class="resumen-subtotal">' +
        '<span>Subtotal</span>' +
        '<span>' + formatPrice(total) + '</span>' +
      '</div>' +
      '<div class="resumen-envio">' +
        '<span>Envío</span>' +
        '<span class="envio-gratis">Gratis</span>' +
      '</div>' +
      '<div class="resumen-total">' +
        '<span>Total</span>' +
        '<span class="total-valor">' + formatPrice(total) + '</span>' +
      '</div>' +
      '<div class="resumen-proteccion">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
        '<span>Tu compra está protegida</span>' +
      '</div>'
  }

  render()
  document.addEventListener('cart:updated', render)

  var confirmBtn = document.querySelector('.btn-confirmar')
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function (e) {
      e.preventDefault()
      var cart = getCart()
      if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de confirmar la compra.')
        return
      }
      var nombre = document.getElementById('nombre')
      var email = document.getElementById('email')
      var direccion = document.getElementById('direccion')
      if (!nombre || !nombre.value.trim() || !email || !email.value.trim() || !direccion || !direccion.value.trim()) {
        alert('Completa los datos personales y de entrega antes de confirmar.')
        return
      }
      alert('¡Compra confirmada! Te enviaremos un resumen a ' + email.value.trim())
      clearCart()
      window.location.href = 'index.html'
    })
  }
})
