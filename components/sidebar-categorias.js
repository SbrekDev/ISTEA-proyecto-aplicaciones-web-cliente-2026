function cargarSidebarCategorias(containerId, showFiltros) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var filtrosHTML = showFiltros ? '' +
        '<div class="filtros">' +
            '<h3>Filtrar por</h3>' +
            '<div class="filtro-grupo">' +
                '<h4>Precio</h4>' +
                '<div class="rango-precio">' +
                    '<input type="number" id="filtro-precio-min" placeholder="Mín" min="0">' +
                    '<span>-</span>' +
                    '<input type="number" id="filtro-precio-max" placeholder="Máx" min="0">' +
                '</div>' +
            '</div>' +
            '<div class="filtro-grupo">' +
                '<h4>Jugadores</h4>' +
                '<div class="rango-precio">' +
                    '<input type="number" id="filtro-jugadores-min" placeholder="Mín" min="1">' +
                    '<span>-</span>' +
                    '<input type="number" id="filtro-jugadores-max" placeholder="Máx" min="1">' +
                '</div>' +
            '</div>' +
            '<div class="filtro-grupo">' +
                '<h4>Edad mínima</h4>' +
                '<select id="filtro-edad">' +
                    '<option value="">Todas</option>' +
                    '<option value="3">3+</option>' +
                    '<option value="6">6+</option>' +
                    '<option value="8">8+</option>' +
                    '<option value="10">10+</option>' +
                    '<option value="12">12+</option>' +
                    '<option value="14">14+</option>' +
                    '<option value="16">16+</option>' +
                    '<option value="18">18+</option>' +
                '</select>' +
            '</div>' +
            '<button class="btn-aplicar-filtros" id="btn-aplicar-filtros">Aplicar Filtros</button>' +
            '<button class="btn-limpiar-filtros" id="btn-limpiar-filtros">Limpiar Filtros</button>' +
        '</div>' : '';

    container.innerHTML =
        '<aside class="sidebar-categorias">' +
            '<h2>Categorías</h2>' +
            '<ul class="categorias-list" id="categorias-list">' +
                '<li><a href="catalogo.html" class="cat-link">Todos</a></li>' +
                '<li><a href="catalogo.html?categoria=estrategia" class="cat-link">Juegos de Estrategia</a></li>' +
                '<li><a href="catalogo.html?categoria=cartas" class="cat-link">Juegos de Cartas</a></li>' +
                '<li><a href="catalogo.html?categoria=dados" class="cat-link">Juegos de Dados</a></li>' +
                '<li><a href="catalogo.html?categoria=infantiles" class="cat-link">Juegos Infantiles</a></li>' +
                '<li><a href="catalogo.html?categoria=cooperativos" class="cat-link">Juegos Cooperativos</a></li>' +
                '<li><a href="catalogo.html?categoria=familia" class="cat-link">Juegos de Familia</a></li>' +
                '<li><a href="catalogo.html?categoria=party" class="cat-link">Juegos Party</a></li>' +
                '<li><a href="catalogo.html?categoria=eurogame" class="cat-link">Eurojuegos</a></li>' +
                '<li><a href="catalogo.html?categoria=tematico" class="cat-link">Juegos Temáticos</a></li>' +
            '</ul>' +
            filtrosHTML +
        '</aside>'
    ;

    var params = obtenerFiltrosCombinados();

    if (showFiltros) {
        if (params.get('precio_min')) document.getElementById('filtro-precio-min').value = params.get('precio_min');
        if (params.get('precio_max')) document.getElementById('filtro-precio-max').value = params.get('precio_max');
        if (params.get('jugadores_min')) document.getElementById('filtro-jugadores-min').value = params.get('jugadores_min');
        if (params.get('jugadores_max')) document.getElementById('filtro-jugadores-max').value = params.get('jugadores_max');
        if (params.get('edad_min')) document.getElementById('filtro-edad').value = params.get('edad_min');

        document.getElementById('btn-aplicar-filtros').addEventListener('click', function () {
            var nuevos = new URLSearchParams();
            if (params.get('categoria')) nuevos.set('categoria', params.get('categoria'));
            var pMin = document.getElementById('filtro-precio-min').value;
            var pMax = document.getElementById('filtro-precio-max').value;
            if (pMin) nuevos.set('precio_min', pMin);
            if (pMax) nuevos.set('precio_max', pMax);
            var jMin = document.getElementById('filtro-jugadores-min').value;
            var jMax = document.getElementById('filtro-jugadores-max').value;
            if (jMin) nuevos.set('jugadores_min', jMin);
            if (jMax) nuevos.set('jugadores_max', jMax);
            var edad = document.getElementById('filtro-edad').value;
            if (edad) nuevos.set('edad_min', edad);
            guardarFiltros(nuevos);
            window.location.href = 'catalogo.html?' + nuevos.toString();
        });

        document.getElementById('btn-limpiar-filtros').addEventListener('click', function () {
            sessionStorage.removeItem('zonix_filters');
            window.location.href = 'catalogo.html';
        });
    }

    marcarCategoriaActiva(params.get('categoria'));

    var todosLink = document.querySelector('.categorias-list a[href="catalogo.html"]');
    if (todosLink) {
        todosLink.addEventListener('click', function () {
            sessionStorage.removeItem('zonix_filters');
        });
    }
}

function obtenerFiltrosCombinados() {
    var params = new URLSearchParams(window.location.search);
    var guardados = sessionStorage.getItem('zonix_filters');
    if (guardados) {
        try {
            var obj = JSON.parse(guardados);
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && !params.has(key)) {
                    params.set(key, obj[key]);
                }
            }
        } catch (e) {}
    }
    return params;
}

function guardarFiltros(params) {
    var obj = {};
    params.forEach(function (value, key) {
        obj[key] = value;
    });
    sessionStorage.setItem('zonix_filters', JSON.stringify(obj));
}

function marcarCategoriaActiva(categoria) {
    var links = document.querySelectorAll('.categorias-list a');
    if (!categoria) {
        if (links.length > 0) links[0].classList.add('active');
        return;
    }
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        var idx = href.indexOf('?');
        if (idx !== -1) {
            var linkParams = new URLSearchParams(href.substring(idx));
            if (linkParams.get('categoria') && linkParams.get('categoria').toLowerCase() === categoria.toLowerCase()) {
                links[i].classList.add('active');
                break;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        var showFiltros = sidebarContainer.getAttribute('data-show-filtros') === 'true';
        cargarSidebarCategorias('sidebar-container', showFiltros);
    }
});
