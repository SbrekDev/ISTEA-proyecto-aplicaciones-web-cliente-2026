document.addEventListener('DOMContentLoaded', function() {
    var navHTML = `
    <nav id="main-nav">
        <div class="nav-left">
            <ul>
                <li><a href="/index.html" data-page="index">Inicio</a></li>
                <li><a href="/catalogo.html" data-page="catalogo">Catálogo</a></li>
                <li><a href="/ofertas.html" data-page="ofertas">Ofertas</a></li>
                <li><a href="/contact.html" data-page="contact">Contacto</a></li>
            </ul>
        </div>
        <div class="nav-right">
            <div class="carrito-container">
                <button id="btn-carrito" class="carrito-btn" aria-label="Ver carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span class="carrito-count">3</span>
                </button>
                <div id="carrito-dropdown" class="carrito-dropdown">
                    <h3>Tu Carrito</h3>
                    <div class="carrito-items">
                        <div class="carrito-producto">
                            <img src="https://placehold.co/50x50/2c3e50/fff?text=Catan" alt="Catan">
                            <div class="carrito-producto-info">
                                <h4>Catan</h4>
                                <span class="carrito-producto-cantidad">1 x $45.000</span>
                            </div>
                        </div>
                        <div class="carrito-producto">
                            <img src="https://placehold.co/50x50/3498db/fff?text=Carcassonne" alt="Carcassonne">
                            <div class="carrito-producto-info">
                                <h4>Carcassonne</h4>
                                <span class="carrito-producto-cantidad">1 x $35.000</span>
                            </div>
                        </div>
                        <div class="carrito-producto">
                            <img src="https://placehold.co/50x50/e74c3c/fff?text=Ticket" alt="Ticket to Ride">
                            <div class="carrito-producto-info">
                                <h4>Ticket to Ride</h4>
                                <span class="carrito-producto-cantidad">1 x $50.000</span>
                            </div>
                        </div>
                    </div>
                    <div class="carrito-total">
                        <span>Total:</span>
                        <span class="carrito-precio">$130.000</span>
                    </div>
                    <button class="btn-ver-carrito" onclick="window.location.href='/carrito.html'">Ver Carrito</button>
                </div>
            </div>
        </div>
    </nav>
    `;

    var placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.outerHTML = navHTML;
    } else {
        var header = document.querySelector('header');
        if (header) {
            var navTemp = document.createElement('div');
            navTemp.innerHTML = navHTML;
            header.parentNode.insertBefore(navTemp.firstChild, header.nextSibling);
        }
    }

    var currentPage = document.body.getAttribute('data-page') || 'index';
    var links = document.querySelectorAll('#main-nav a[data-page]');
    links.forEach(function(link) {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });

    var btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                window.location.href = '/carrito.html';
            } else {
                e.stopPropagation();
                var dropdown = document.getElementById('carrito-dropdown');
                dropdown.classList.toggle('active');
            }
        });
    }

    document.addEventListener('click', function() {
        var dropdown = document.getElementById('carrito-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });

    var dropdown = document.getElementById('carrito-dropdown');
    if (dropdown) {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});