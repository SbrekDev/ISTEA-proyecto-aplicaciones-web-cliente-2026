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

    if (showFiltros) {
        var btn = document.getElementById('btn-aplicar-filtros')
        if (btn) {
            btn.addEventListener('click', function () {
                var params = new URLSearchParams()
                var cat = new URLSearchParams(window.location.search).get('categoria')
                if (cat) params.set('categoria', cat)
                var pMin = document.getElementById('filtro-precio-min').value
                var pMax = document.getElementById('filtro-precio-max').value
                if (pMin) params.set('precio_min', pMin)
                if (pMax) params.set('precio_max', pMax)
                var jMin = document.getElementById('filtro-jugadores-min').value
                var jMax = document.getElementById('filtro-jugadores-max').value
                if (jMin) params.set('jugadores_min', jMin)
                if (jMax) params.set('jugadores_max', jMax)
                var edad = document.getElementById('filtro-edad').value
                if (edad) params.set('edad_min', edad)
                window.location.href = 'catalogo.html?' + params.toString()
            })
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
