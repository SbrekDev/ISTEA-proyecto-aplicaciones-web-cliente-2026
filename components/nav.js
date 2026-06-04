document.addEventListener('DOMContentLoaded', function() {
    var navHTML = `
    <nav id="main-nav">
        <div class="nav-left">
            <ul>
                <li><a href="index.html" data-page="index">Inicio</a></li>
                <li><a href="catalogo.html" data-page="catalogo">Catálogo</a></li>
                <li><a href="ofertas.html" data-page="ofertas">Ofertas</a></li>
                <li><a href="contact.html" data-page="contact">Contacto</a></li>
            </ul>
        </div>
        <div class="nav-right">
            <a href="login.html" class="auth-link" data-page="login">Iniciar sesión</a>
            <a href="crear-cuenta.html" class="auth-link" data-page="crear-cuenta">Crear cuenta</a>
            <div class="carrito-container">
                <button id="btn-carrito" class="carrito-btn" aria-label="Ver carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span class="carrito-count">3</span>
                </button>
                <div id="carrito-dropdown" class="carrito-dropdown">
                    <h3>Tu Carrito</h3>
                    <div class="carrito-items">
                        <div class="carrito-producto">
                            <img src="assets/images/catan1.webp" alt="Catan">
                            <div class="carrito-producto-info">
                                <h4>Catan</h4>
                                <span class="carrito-producto-cantidad">1 x $45.000</span>
                            </div>
                        </div>
                        <div class="carrito-producto">
                            <img src="assets/images/carcassone.webp" alt="Carcassonne">
                            <div class="carrito-producto-info">
                                <h4>Carcassonne</h4>
                                <span class="carrito-producto-cantidad">1 x $35.000</span>
                            </div>
                        </div>
                        <div class="carrito-producto">
                            <img src="assets/images/tickettoride.webp" alt="Ticket to Ride">
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
                    <button class="btn-ver-carrito" onclick="window.location.href='carrito.html'">Ver Carrito</button>
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

    var zonixUser = sessionStorage.getItem('zonix_user')
    if (zonixUser === 'admin' || zonixUser === 'user') {
        var navLeftUl = document.querySelector('.nav-left ul')
        if (zonixUser === 'admin' && navLeftUl) {
            var adminLi = document.createElement('li')
            var adminLink = document.createElement('a')
            adminLink.href = 'admin-productos.html'
            adminLink.setAttribute('data-page', 'admin-productos')
            adminLink.textContent = 'Admin'
            if (currentPage === 'admin-productos') {
                adminLink.classList.add('active')
            }
            adminLi.appendChild(adminLink)
            navLeftUl.appendChild(adminLi)
        }

        var email = sessionStorage.getItem('zonix_email') || 'Usuario'
        var greeting = document.createElement('span')
        greeting.textContent = 'Hola ' + email
        greeting.style.cssText = 'color:var(--primary-color);font-weight:600;font-size:0.9rem;padding:0 var(--spacing-sm);white-space:nowrap;'

        var logoutBtn = document.createElement('button')
        logoutBtn.textContent = 'Cerrar sesión'
        logoutBtn.className = 'auth-link'
        logoutBtn.style.cssText = 'background:none;border:none;cursor:pointer;font:inherit;padding:var(--spacing-sm) var(--spacing-md);color:var(--primary-color);border-radius:var(--border-radius);transition:background var(--transition),color var(--transition);'
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--secondary-color)'
            this.style.color = '#fff'
        })
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none'
            this.style.color = 'var(--primary-color)'
        })
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('zonix_user')
            sessionStorage.removeItem('zonix_email')
            window.location.href = 'index.html'
        })

        var navRight = document.querySelector('.nav-right')
        if (navRight) {
            var authLinks = navRight.querySelectorAll('.auth-link')
            authLinks.forEach(function(link) {
                link.style.display = 'none'
            })
            navRight.insertBefore(greeting, navRight.firstChild)
            navRight.insertBefore(logoutBtn, navRight.firstChild)
        }
    }

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