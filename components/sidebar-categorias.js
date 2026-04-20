function cargarSidebarCategorias(containerId, showFiltros = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtrosHTML = showFiltros ? `
        <div class="filtros">
            <h3>Filtrar por</h3>
            
            <div class="filtro-grupo">
                <h4>Precio</h4>
                <div class="rango-precio">
                    <input type="number" placeholder="Mín" min="0">
                    <span>-</span>
                    <input type="number" placeholder="Máx" min="0">
                </div>
            </div>

            <div class="filtro-grupo">
                <h4>Distribuidora</h4>
                <label class="checkbox-label">
                    <input type="checkbox" name="distribuidora" value="devir"> Devir
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="distribuidora" value="asmodee"> Asmodee
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="distribuidora" value="maldito"> Maldito Games
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="distribuidora" value="maldon"> Maldon
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="distribuidora" value="ruibal"> Ruibal
                </label>
            </div>

            <div class="filtro-grupo">
                <h4>Envío</h4>
                <label class="checkbox-label">
                    <input type="checkbox" name="envio-gratis"> Envío gratis
                </label>
            </div>

            <button class="btn-aplicar-filtros">Aplicar Filtros</button>
        </div>
    ` : '';

    container.innerHTML = `
        <aside class="sidebar-categorias">
            <h2>Categorías</h2>
            <ul class="categorias-list">
                <li><a href="/catalogo.html">Todos</a></li>
                <li><a href="/catalogo.html?categoria=estrategia">Juegos de Estrategia</a></li>
                <li><a href="/catalogo.html?categoria=cartas">Juegos de Cartas</a></li>
                <li><a href="/catalogo.html?categoria=dados">Juegos de Dados</a></li>
                <li><a href="/catalogo.html?categoria=infantiles">Juegos Infantiles</a></li>
                <li><a href="/catalogo.html?categoria=cooperativos">Juegos Cooperativos</a></li>
            </ul>
            ${filtrosHTML}
        </aside>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        const showFiltros = sidebarContainer.getAttribute('data-show-filtros') === 'true';
        cargarSidebarCategorias('sidebar-container', showFiltros);
    }
});