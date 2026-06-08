document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.carrito-items-section')
  var resumen = document.querySelector('.carrito-resumen')
  if (!section && !resumen) return

  function render() {
    var cart = getCart()

    if (cart.length === 0) {
      section.innerHTML = '' +
        '<h2>Tu Carrito (<span id="carrito-cantidad">0</span> productos)</h2>' +
        '<div class="carrito-vacio" style="text-align:center;padding:3rem;color:var(--text-muted);">' +
          '<p style="font-size:1.2rem;margin-bottom:1rem;">Tu carrito está vacío</p>' +
          '<a href="catalogo.html" class="btn-ver-detalle" style="display:inline-block;">Ir al catálogo</a>' +
        '</div>'
      if (resumen) {
        resumen.innerHTML =
          '<h3>Resumen de Compra</h3>' +
          '<div class="resumen-items">' +
            '<div class="resumen-item"><span>0 productos</span><span>$0</span></div>' +
          '</div>' +
          '<div class="resumen-total"><span>Total</span><span class="total-valor">$0</span></div>' +
          '<div class="resumen-seguridad">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
            '<span>Comprá con seguridad</span>' +
          '</div>'
      }
      return
    }

    var count = getCartCount()
    var total = getCartTotal()

    section.innerHTML = '' +
      '<h2>Tu Carrito (<span id="carrito-cantidad">' + count + '</span> productos)</h2>' +
      cart.map(function (item) {
        var imgSrc = item.imageurl || getDefaultImage()
        var catLabel = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : ''
        return '' +
          '<div class="carrito-producto-item" data-id="' + item.id + '">' +
            '<button class="btn-cerrar-item btn-remove" data-id="' + item.id + '" aria-label="Eliminar producto">&times;</button>' +
            '<div class="item-info-group">' +
              '<div class="item-imagen">' +
                '<img src="' + imgSrc + '" alt="' + item.name + '" onerror="this.src=\'' + getDefaultImage() + '\'">' +
              '</div>' +
              '<div class="item-detalles">' +
                '<h3 class="item-titulo">' + item.name + '</h3>' +
                (catLabel ? '<p class="item-categoria">' + catLabel + '</p>' : '') +
                '<p class="item-disponibilidad"> stock disponible</p>' +
              '</div>' +
            '</div>' +
            '<div class="item-cantidad">' +
              '<div class="cantidad-control">' +
                '<button class="cantidad-btn btn-qty-minus" data-id="' + item.id + '" aria-label="Decrease">-</button>' +
                '<input type="number" value="' + item.quantity + '" min="1" readonly class="qty-input">' +
                '<button class="cantidad-btn btn-qty-plus" data-id="' + item.id + '" aria-label="Increase">+</button>' +
              '</div>' +
            '</div>' +
            '<div class="item-precio">' +
              '<span class="precio-valor">' + formatPrice(item.price * item.quantity) + '</span>' +
            '</div>' +
          '</div>'
      }).join('')

    if (resumen) {
      resumen.innerHTML =
        '<h3>Resumen de Compra</h3>' +
        '<div class="resumen-items">' +
          '<div class="resumen-item">' +
            '<span>' + count + ' productos</span>' +
            '<span>' + formatPrice(total) + '</span>' +
          '</div>' +
          '<div class="resumen-item">' +
            '<span>Envío</span>' +
            '<span class="envio-gratis">Gratis</span>' +
          '</div>' +
        '</div>' +
        '<div class="resumen-total">' +
          '<span>Total</span>' +
          '<span class="total-valor">' + formatPrice(total) + '</span>' +
        '</div>' +
        '<button class="btn-comprar" onclick="window.location.href=\'checkout.html\'">Comprar</button>' +
        '<div class="resumen-seguridad">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
          '<span>Comprá con seguridad</span>' +
        '</div>'
    }

    section.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeFromCart(parseInt(this.getAttribute('data-id')))
        render()
      })
    })

    section.querySelectorAll('.btn-qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'))
        var item = getCart().find(function (i) { return i.id === id })
        if (item) {
          if (item.quantity <= 1) {
            removeFromCart(id)
          } else {
            updateQuantity(id, item.quantity - 1)
          }
          render()
        }
      })
    })

    section.querySelectorAll('.btn-qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'))
        var item = getCart().find(function (i) { return i.id === id })
        if (item) {
          updateQuantity(id, item.quantity + 1)
          render()
        }
      })
    })
  }

  render()

  document.addEventListener('cart:updated', render)
})
