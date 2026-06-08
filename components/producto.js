document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search)
  var productId = params.get('id')
  if (!productId) {
    mostrarError('No se especificó un producto.')
    return
  }

  var mainContainer = document.querySelector('.producto-detalle')
  if (!mainContainer) return

  mainContainer.innerHTML = '<div class="admin-loading" style="text-align:center;padding:3rem;">Cargando producto...</div>'

  getProductById(parseInt(productId))
    .then(function (p) {
      if (!p) {
        mostrarError('Producto no encontrado.')
        return
      }
      renderProduct(p)
    })
    .catch(function (err) {
      mostrarError('Error al cargar producto: ' + err.message)
    })

  function mostrarError(msg) {
    var c = document.querySelector('.producto-detalle')
    if (c) c.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--error);">' + msg + '</div>'
  }

  function renderProduct(p) {
    var imgSrc = p.imageurl || getDefaultImage()
    var desc = p.description || ''
    var categoryLabel = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'General'
    var playerRange = (p.minplayers || '?') + ' a ' + (p.maxplayers || '?')
    var ageText = (p.minage || '?') + '+ años'
    var stockText = p.stock !== null && p.stock !== undefined && p.stock > 0
      ? 'Stock disponible (' + p.stock + ' uds.)'
      : 'Sin stock'

    var isOffer = p.offer === true
    var discountPct = isOffer && p.offerpercentage ? p.offerpercentage : 0
    var originalPrice = p.price
    var discountedPrice = isOffer ? p.price * (1 - discountPct / 100) : p.price
    var displayPrice = isOffer ? discountedPrice : originalPrice

    document.title = p.name + ' - ZONIX'

    mainContainer.innerHTML =
      '<div class="producto-layout">' +
        '<section class="producto-info">' +
          '<span class="producto-categoria">' + categoryLabel + '</span>' +
          (isOffer ? '<span class="descuento" style="display:inline-block;margin-top:0.5rem;">-' + discountPct + '%</span>' : '') +
          '<h1 class="producto-titulo">' + p.name + '</h1>' +
          '<p class="producto-resumen">' + desc + '</p>' +

          '<div class="producto-precio-box">' +
            '<div class="precio-actual">' +
              '<span class="precio-label">Precio</span>' +
              (isOffer ? '<span class="precio-original" style="display:block;font-size:1rem;">' + formatPrice(originalPrice) + '</span>' : '') +
              '<span class="precio-valor">' + formatPrice(displayPrice) + '</span>' +
            '</div>' +
            '<div class="cuotas">' +
              '<span class="cuotas-valor">12</span>' +
              '<span class="cuotas-texto">cuotas sin interés de <strong>' + formatPrice(displayPrice / 12) + '</strong></span>' +
            '</div>' +
            '<div class="metodos-pago">' +
              '<span class="metodo-icon">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>' +
                ' Tarjeta de crédito' +
              '</span>' +
              '<span class="metodo-icon">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>' +
                ' Tarjeta de débito' +
              '</span>' +
              '<span class="metodo-icon">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>' +
                ' Efectivo' +
              '</span>' +
            '</div>' +
          '</div>' +

          '<div class="producto-cantidad">' +
            '<label for="cantidad">Cantidad:</label>' +
            '<div class="cantidad-control">' +
              '<button type="button" class="cantidad-btn" data-action="decrease">−</button>' +
              '<input type="number" id="cantidad" name="cantidad" value="1" min="1" max="' + (p.stock || 10) + '">' +
              '<button type="button" class="cantidad-btn" data-action="increase">+</button>' +
            '</div>' +
            '<span class="stock-disponible">' + stockText + '</span>' +
          '</div>' +

          '<div class="producto-acciones">' +
            '<button class="btn-agregar-carrito" id="btn-add-cart">Agregar al carrito</button>' +
            '<button class="btn-comprar-ahora" id="btn-buy-now">Comprar ahora</button>' +
          '</div>' +

          '<div class="producto-envio">' +
            '<div class="envio-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>' +
            '</div>' +
            '<div class="envio-info">' +
              '<p class="envio-titulo">Envío a todo el país</p>' +
              '<p class="envio-llegada">Llega a tu domicilio</p>' +
              '<p class="envio-costo">Ver costos de envío</p>' +
            '</div>' +
          '</div>' +

          '<div class="producto-proteccion">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
            '<span>Compra protegida, siempre</span>' +
          '</div>' +
        '</section>' +

        '<section class="producto-galeria">' +
          '<div class="galeria-principal">' +
            '<input type="radio" name="galeria" id="img1" checked class="galeria-radio">' +
            '<div class="galeria-contenido">' +
              '<div class="galeria-slide">' +
                '<img src="' + imgSrc + '" alt="' + p.name + '" onerror="this.src=\'' + getDefaultImage() + '\'">' +
              '</div>' +
            '</div>' +
            '<nav class="galeria-nav">' +
              '<label for="img1" class="thumb"><img src="' + imgSrc + '" alt="Miniatura" onerror="this.src=\'' + getDefaultImage() + '\'"></label>' +
            '</nav>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<section class="producto-caracteristicas">' +
        '<h2>Características</h2>' +
        '<div class="caracteristicas-grid">' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Jugadores</span>' +
              '<span class="caracteristica-valor">' + playerRange + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Duración</span>' +
              '<span class="caracteristica-valor">' + (p.gametime || 'N/A') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Edad</span>' +
              '<span class="caracteristica-valor">' + ageText + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Idioma</span>' +
              '<span class="caracteristica-valor">' + (p.language || 'N/A') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Editorial</span>' +
              '<span class="caracteristica-valor">' + (p.editorial || 'N/A') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="caracteristica-item">' +
            '<span class="caracteristica-icono">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>' +
            '</span>' +
            '<div class="caracteristica-info">' +
              '<span class="caracteristica-label">Categoría</span>' +
              '<span class="caracteristica-valor">' + categoryLabel + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="producto-descripcion">' +
        '<h2>Descripción</h2>' +
        '<div class="descripcion-contenido">' +
          '<p>' + desc + '</p>' +
        '</div>' +
      '</section>'

    document.getElementById('btn-add-cart').addEventListener('click', function () {
      var qty = parseInt(document.getElementById('cantidad').value) || 1
      addToCart({
        id: p.id,
        name: p.name,
        price: displayPrice,
        imageurl: p.imageurl,
        category: p.category
      }, qty)
      this.textContent = '✓ Agregado al carrito'
      var self = this
      setTimeout(function () { self.textContent = 'Agregar al carrito' }, 2000)
    })

    document.getElementById('btn-buy-now').addEventListener('click', function () {
      var qty = parseInt(document.getElementById('cantidad').value) || 1
      addToCart({
        id: p.id,
        name: p.name,
        price: displayPrice,
        imageurl: p.imageurl,
        category: p.category
      }, qty)
      window.location.href = 'checkout.html'
    })

    var qtyInput = document.getElementById('cantidad')
    var decreaseBtn = document.querySelector('.cantidad-btn[data-action="decrease"]')
    var increaseBtn = document.querySelector('.cantidad-btn[data-action="increase"]')
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function () {
        var val = parseInt(qtyInput.value) || 1
        if (val > 1) qtyInput.value = val - 1
      })
    }
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function () {
        var val = parseInt(qtyInput.value) || 1
        var max = parseInt(qtyInput.getAttribute('max')) || 10
        if (val < max) qtyInput.value = val + 1
      })
    }
  }
})
