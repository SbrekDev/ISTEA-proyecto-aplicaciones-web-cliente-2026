document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('#ofertas .productos-grid')
  if (!grid) return

  grid.innerHTML = '<div class="admin-loading" style="grid-column:1/-1;text-align:center;padding:2rem;">Cargando ofertas...</div>'

  getAllProducts()
    .then(function (products) {
      if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No hay productos disponibles.</p>'
        return
      }

      var offerProducts = products.filter(function (p) { return p.offer === true })

      if (offerProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No hay ofertas disponibles en este momento.</p>'
        return
      }

      grid.innerHTML = offerProducts.map(function (p) {
        var imgSrc = p.imageurl || getDefaultImage()
        var desc = p.description || ''
        var discountPct = p.offerpercentage || 0
        var discountedPrice = p.price * (1 - discountPct / 100)
        return '' +
          '<article class="producto-card oferta">' +
            '<span class="descuento">-' + discountPct + '%</span>' +
            '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + getDefaultImage() + '\'">' +
            '<div class="producto-info">' +
              '<h3>' + p.name + '</h3>' +
              '<p class="descripcion">' + desc + '</p>' +
              '<p class="precio">' +
                '<span class="precio-original">' + formatPrice(p.price) + '</span> ' +
                formatPrice(discountedPrice) +
              '</p>' +
              '<div class="producto-botones">' +
                '<button class="btn-agregar-carrito" data-id="' + p.id + '" data-name="' + p.name.replace(/"/g, '&quot;') + '" data-price="' + discountedPrice + '" data-image="' + imgSrc + '" data-category="' + (p.category || '') + '">Agregar al Carrito</button>' +
                '<a href="producto.html?id=' + p.id + '" class="btn-detalles">Ver Detalles</a>' +
              '</div>' +
            '</div>' +
          '</article>'
      }).join('')

      grid.querySelectorAll('.btn-agregar-carrito').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var product = {
            id: parseInt(this.getAttribute('data-id')),
            name: this.getAttribute('data-name'),
            price: parseFloat(this.getAttribute('data-price')),
            imageurl: this.getAttribute('data-image'),
            category: this.getAttribute('data-category')
          }
          addToCart(product, 1)
          showCartFeedback(this)
        })
      })
    })
    .catch(function (err) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--error);padding:2rem;">Error al cargar ofertas: ' + err.message + '</p>'
    })
})

function showCartFeedback(btn) {
  var original = btn.textContent
  btn.textContent = '✓ Agregado'
  btn.style.background = 'var(--success, #28a745)'
  btn.style.color = '#fff'
  setTimeout(function () {
    btn.textContent = original
    btn.style.background = ''
    btn.style.color = ''
  }, 1500)
}
