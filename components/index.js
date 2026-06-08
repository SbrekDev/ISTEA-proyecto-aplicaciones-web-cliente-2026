document.addEventListener('DOMContentLoaded', function () {
  var destacadosGrid = document.querySelector('#destacados .grid-destacados')
  var ofertasGrid = document.querySelector('#mejores-ofertas .grid-destacados')
  if (!destacadosGrid && !ofertasGrid) return

  getAllProducts()
    .then(function (products) {
      if (!products || products.length === 0) {
        if (destacadosGrid) destacadosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No hay productos destacados disponibles.</p>'
        if (ofertasGrid) ofertasGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No hay ofertas disponibles.</p>'
        return
      }

      var offerProducts = products.filter(function (p) { return p.offer === true })

      if (destacadosGrid) {
        var featured = products.slice(0, 4)
        destacadosGrid.innerHTML = featured.map(function (p) {
          var imgSrc = p.imageurl || getDefaultImage()
          var desc = p.description || ''
          var isOffer = p.offer === true
          var discountPct = isOffer && p.offerpercentage ? p.offerpercentage : 0
          var discountedPrice = isOffer ? p.price * (1 - discountPct / 100) : p.price
          return '' +
            '<article class="card-destacado' + (isOffer ? ' oferta' : '') + '">' +
              (isOffer ? '<span class="descuento">-' + discountPct + '%</span>' : '') +
              '<div class="card-imagen">' +
                '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + getDefaultImage() + '\'">' +
              '</div>' +
              '<div class="card-contenido">' +
                '<h3>' + p.name + '</h3>' +
                '<p class="card-descripcion">' + desc + '</p>' +
                '<p class="card-precio">' +
                  (isOffer ? '<span class="precio-original">' + formatPrice(p.price) + '</span> ' : '') +
                  formatPrice(discountedPrice) +
                '</p>' +
                '<a href="producto.html?id=' + p.id + '" class="btn-ver-detalle">Ver Detalle</a>' +
              '</div>' +
            '</article>'
        }).join('')
      }

      if (ofertasGrid) {
        if (offerProducts.length === 0) {
          ofertasGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No hay ofertas disponibles.</p>'
          return
        }
        ofertasGrid.innerHTML = offerProducts.slice(0, 6).map(function (p) {
          var imgSrc = p.imageurl || getDefaultImage()
          var desc = p.description || ''
          var discountPct = p.offerpercentage || 0
          var discountedPrice = p.price * (1 - discountPct / 100)
          return '' +
            '<article class="producto-card oferta">' +
              '<span class="descuento">-' + discountPct + '%</span>' +
              '<div class="card-imagen">' +
                '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + getDefaultImage() + '\'">' +
              '</div>' +
              '<div class="card-contenido">' +
                '<h3>' + p.name + '</h3>' +
                '<p class="card-descripcion">' + desc + '</p>' +
                '<p class="card-precio">' +
                  '<span class="precio-original">' + formatPrice(p.price) + '</span> ' +
                  formatPrice(discountedPrice) +
                '</p>' +
                '<a href="producto.html?id=' + p.id + '" class="btn-ver-detalle">Ver Detalle</a>' +
              '</div>' +
            '</article>'
        }).join('')
      }
    })
    .catch(function (err) {
      if (destacadosGrid) destacadosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--error);">Error al cargar productos: ' + err.message + '</p>'
      if (ofertasGrid) ofertasGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--error);">Error al cargar productos: ' + err.message + '</p>'
    })
})
