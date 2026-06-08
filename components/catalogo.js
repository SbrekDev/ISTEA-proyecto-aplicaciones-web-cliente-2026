document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('.productos-grid')
  if (!grid) return

  var params = new URLSearchParams(window.location.search)
  var catFilter = params.get('categoria')
  var precioMin = params.get('precio_min')
  var precioMax = params.get('precio_max')
  var jugMin = params.get('jugadores_min')
  var jugMax = params.get('jugadores_max')
  var edadMin = params.get('edad_min')
  var searchQuery = params.get('search')

  var searchInput = document.getElementById('search-input')

  if (searchInput && searchQuery) {
    searchInput.value = searchQuery
  }

  grid.innerHTML = '<div class="admin-loading" style="grid-column:1/-1;text-align:center;padding:2rem;">Cargando productos...</div>'

  getAllProducts()
    .then(function (products) {
      if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No se encontraron productos.</p>'
        return
      }

      var filtered = products.slice()

      if (catFilter) {
        filtered = filtered.filter(function (p) {
          return p.category && p.category.toLowerCase() === catFilter.toLowerCase()
        })
      }

      if (precioMin) {
        filtered = filtered.filter(function (p) {
          var effectivePrice = (p.offer === true && p.offerpercentage) ? p.price * (1 - p.offerpercentage / 100) : p.price
          return effectivePrice >= parseFloat(precioMin)
        })
      }
      if (precioMax) {
        filtered = filtered.filter(function (p) {
          var effectivePrice = (p.offer === true && p.offerpercentage) ? p.price * (1 - p.offerpercentage / 100) : p.price
          return effectivePrice <= parseFloat(precioMax)
        })
      }

      if (jugMin) {
        filtered = filtered.filter(function (p) { return p.maxplayers >= parseInt(jugMin) })
      }
      if (jugMax) {
        filtered = filtered.filter(function (p) { return p.minplayers <= parseInt(jugMax) })
      }

      if (edadMin) {
        filtered = filtered.filter(function (p) { return p.minage >= parseInt(edadMin) })
      }

      if (searchQuery) {
        var q = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(function (p) {
          return (p.name && p.name.toLowerCase().includes(q)) ||
                 (p.description && p.description.toLowerCase().includes(q)) ||
                 (p.category && p.category.toLowerCase().includes(q))
        })
      }

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No se encontraron productos con los filtros seleccionados.</p>'
        return
      }

      grid.innerHTML = filtered.map(function (p) {
        var imgSrc = p.imageurl || getDefaultImage()
        var desc = p.description || ''
        var isOffer = p.offer === true
        var discountPct = isOffer && p.offerpercentage ? p.offerpercentage : 0
        var discountedPrice = isOffer ? p.price * (1 - discountPct / 100) : p.price
        return '' +
          '<article class="producto-card' + (isOffer ? ' oferta' : '') + '">' +
            (isOffer ? '<span class="descuento">-' + discountPct + '%</span>' : '') +
            '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + getDefaultImage() + '\'">' +
            '<div class="producto-info">' +
              '<h3>' + p.name + '</h3>' +
              '<p class="descripcion">' + desc + '</p>' +
              '<p class="precio">' +
                (isOffer ? '<span class="precio-original">' + formatPrice(p.price) + '</span> ' : '') +
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
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--error);padding:2rem;">Error al cargar productos: ' + err.message + '</p>'
    })

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var params = new URLSearchParams(window.location.search)
        if (this.value.trim()) {
          params.set('search', this.value.trim())
        } else {
          params.delete('search')
        }
        window.location.href = 'catalogo.html?' + params.toString()
      }
    })
  }
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
