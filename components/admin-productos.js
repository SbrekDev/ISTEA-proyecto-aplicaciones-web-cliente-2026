document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('zonix_user') !== 'admin') {
        window.location.href = 'index.html'
        return
    }

    var allProducts = []
    var currentEditId = null
    var pendingDeleteId = null

    var grid = document.getElementById('admin-productos-grid')
    var searchInput = document.getElementById('search-input')
    var editModal = document.getElementById('edit-modal')
    var deleteModal = document.getElementById('delete-modal')

    function formatPrice(price) {
        return '$' + Number(price).toLocaleString('es-AR')
    }

    function getDefaultImage() {
        return 'assets/images/thumbnail-default.webp'
    }

    function renderProducts(products) {
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="admin-empty">No se encontraron productos.</div>'
            return
        }

        grid.innerHTML = products.map(function(p) {
            var imgSrc = p.imageurl || getDefaultImage()
            var desc = p.description || 'Sin descripción'
            var isOffer = p.offer === true
            var discountPct = isOffer && p.offerpercentage ? p.offerpercentage : 0
            var discountedPrice = isOffer ? p.price * (1 - discountPct / 100) : p.price
            var stockText = p.stock !== null && p.stock !== undefined ? 'Stock: ' + p.stock : ''

            return '<div class="admin-card' + (isOffer ? ' oferta' : '') + '" data-id="' + p.id + '">' +
                (isOffer ? '<span class="descuento">-' + discountPct + '%</span>' : '') +
                '<div class="card-imagen">' +
                    '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + getDefaultImage() + '\'">' +
                '</div>' +
                '<div class="card-contenido">' +
                    '<div class="card-id">ID: ' + p.id + '</div>' +
                    '<h3>' + p.name + '</h3>' +
                    '<p class="card-descripcion">' + desc + '</p>' +
                    '<p class="card-precio">' +
                        (isOffer ? '<span class="precio-original">' + formatPrice(p.price) + '</span> ' : '') +
                        formatPrice(discountedPrice) +
                    '</p>' +
                    (stockText ? '<p class="card-stock">' + stockText + '</p>' : '') +
                    '<div class="card-acciones">' +
                        '<button class="btn-editar" data-id="' + p.id + '">Editar</button>' +
                        '<button class="btn-eliminar" data-id="' + p.id + '">Eliminar</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        }).join('')

        grid.querySelectorAll('.btn-editar').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'))
                openEditModal(id)
            })
        })

        grid.querySelectorAll('.btn-eliminar').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'))
                openDeleteModal(id)
            })
        })
    }

    function filterAndRender() {
        var query = searchInput.value.trim().toLowerCase()
        if (!query) {
            renderProducts(allProducts)
            return
        }
        var filtered = allProducts.filter(function(p) {
            return p.name && p.name.toLowerCase().includes(query)
        })
        renderProducts(filtered)
    }

    function loadProducts() {
        grid.innerHTML = '<div class="admin-loading">Cargando productos...</div>'
        getAllProducts()
            .then(function(products) {
                allProducts = products
                renderProducts(products)
            })
            .catch(function(err) {
                grid.innerHTML = '<div class="admin-error">Error al cargar productos: ' + err.message + '</div>'
            })
    }

    function openEditModal(id) {
        currentEditId = id
        var product = allProducts.find(function(p) { return p.id === id })
        if (!product) return

        document.getElementById('edit-id').value = product.id
        document.getElementById('edit-nombre').value = product.name || ''
        document.getElementById('edit-descripcion').value = product.description || ''
        document.getElementById('edit-editorial').value = product.editorial || ''
        document.getElementById('edit-jugadores_min').value = product.minplayers || ''
        document.getElementById('edit-jugadores_max').value = product.maxplayers || ''
        document.getElementById('edit-tiempo_juego').value = product.gametime || ''
        document.getElementById('edit-edad_min').value = product.minage || ''
        document.getElementById('edit-categoria').value = product.category || ''
        document.getElementById('edit-idioma').value = product.language || ''
        document.getElementById('edit-precio').value = product.price || ''
        document.getElementById('edit-stock').value = product.stock !== null && product.stock !== undefined ? product.stock : ''
        document.getElementById('edit-imagen_url').value = product.imageurl || ''
        document.getElementById('edit-peso').value = product.weight !== null && product.weight !== undefined ? product.weight : ''

        var isOffer = product.offer === true
        document.getElementById('edit-oferta').value = isOffer ? 'si' : 'no'
        document.getElementById('edit-porcentaje_oferta').value = isOffer && product.offerpercentage ? product.offerpercentage : ''
        document.getElementById('edit-porcentaje_oferta').disabled = !isOffer

        editModal.classList.add('active')
    }

    function closeEditModal() {
        editModal.classList.remove('active')
        currentEditId = null
    }

    function openDeleteModal(id) {
        pendingDeleteId = id
        var product = allProducts.find(function(p) { return p.id === id })
        var msg = product
            ? '¿Estás seguro de que deseas eliminar "' + product.name + '"?'
            : '¿Estás seguro de que deseas eliminar este producto?'
        document.getElementById('delete-message').textContent = msg
        deleteModal.classList.add('active')
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('active')
        pendingDeleteId = null
    }

    function showToast(message, type) {
        var container = document.getElementById('toast-container')
        var toast = document.createElement('div')
        toast.className = 'toast toast-' + type
        toast.textContent = message
        container.appendChild(toast)
        setTimeout(function() {
            toast.classList.add('toast-fade')
            setTimeout(function() { toast.remove() }, 400)
        }, 3500)
    }

    searchInput.addEventListener('input', filterAndRender)

    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault()

        var button = this.querySelector('button[type="submit"]')
        var originalText = button.textContent
        button.disabled = true
        button.textContent = 'Guardando...'

        var updates = {
            name: document.getElementById('edit-nombre').value.trim(),
            description: document.getElementById('edit-descripcion').value.trim(),
            editorial: document.getElementById('edit-editorial').value.trim(),
            minplayers: parseInt(document.getElementById('edit-jugadores_min').value),
            maxplayers: parseInt(document.getElementById('edit-jugadores_max').value),
            gametime: document.getElementById('edit-tiempo_juego').value.trim(),
            minage: parseInt(document.getElementById('edit-edad_min').value),
            category: document.getElementById('edit-categoria').value,
            language: document.getElementById('edit-idioma').value.trim(),
            price: parseFloat(document.getElementById('edit-precio').value),
            stock: document.getElementById('edit-stock').value ? parseInt(document.getElementById('edit-stock').value) : null,
            imageurl: document.getElementById('edit-imagen_url').value.trim() || null,
            weight: document.getElementById('edit-peso').value ? parseFloat(document.getElementById('edit-peso').value) : null,
            offer: document.getElementById('edit-oferta').value === 'si',
            offerpercentage: document.getElementById('edit-oferta').value === 'si' ? parseInt(document.getElementById('edit-porcentaje_oferta').value) : null
        }

        updateProduct(currentEditId, updates)
            .then(function() {
                showToast('Producto actualizado exitosamente', 'success')
                closeEditModal()
                loadProducts()
            })
            .catch(function(err) {
                showToast('Error al actualizar producto: ' + err.message, 'error')
            })
            .finally(function() {
                button.disabled = false
                button.textContent = originalText
            })
    })

    document.getElementById('edit-oferta').addEventListener('change', function () {
        var percInput = document.getElementById('edit-porcentaje_oferta')
        if (this.value === 'si') {
            percInput.disabled = false
        } else {
            percInput.disabled = true
            percInput.value = ''
        }
    })

    document.getElementById('btn-cancelar-edit').addEventListener('click', closeEditModal)

    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) closeEditModal()
    })

    document.getElementById('btn-confirm-delete').addEventListener('click', function() {
        if (!pendingDeleteId) return

        var button = this
        var originalText = button.textContent
        button.disabled = true
        button.textContent = 'Eliminando...'

        deleteProduct(pendingDeleteId)
            .then(function() {
                showToast('Producto eliminado exitosamente', 'success')
                closeDeleteModal()
                loadProducts()
            })
            .catch(function(err) {
                showToast('Error al eliminar producto: ' + err.message, 'error')
            })
            .finally(function() {
                button.disabled = false
                button.textContent = originalText
            })
    })

    document.getElementById('btn-cancelar-delete').addEventListener('click', closeDeleteModal)

    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) closeDeleteModal()
    })

    loadProducts()
})
