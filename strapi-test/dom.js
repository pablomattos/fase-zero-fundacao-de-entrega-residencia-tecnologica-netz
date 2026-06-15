import { BASE_URL } from './api.js';
const container = document.getElementById('dados-container');
const painel = document.getElementById('controls-panel');

export function renderizarCards(artigos) {
    if (!artigos.length) return container.innerHTML = `<p>Nenhum artigo encontrado.</p>`;
    container.innerHTML = artigos.map(art => {
        const cPath = art.cover?.url || art.cover?.formats?.small?.url;
        const aPath = art.author?.avatar?.url || art.author?.avatar?.formats?.thumbnail?.url;
        return `
            <div class="card">
                <img src="${cPath ? BASE_URL + cPath : 'https://placehold.co/400x200'}" class="card-cover">
                <div class="card-content">
                    <div class="meta-container"><span class="badge">${art.category?.name || 'Geral'}</span></div>
                    <h3>${art.title || 'Sem título'}</h3>
                    <p class="description-text">${art.description || 'Sem conteúdo.'}</p>
                    <div class="author-box">
                        <img src="${aPath ? BASE_URL + aPath : 'https://placehold.co/30'}" class="author-avatar">
                        <span class="author-name">${art.author?.name || 'Netz'}</span>
                        <button class="btn-del" data-type="articles" data-id="${art.id}">🗑️</button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

export function configurarFiltros(artigos, autores, callbackFiltro) {
    painel.style.display = 'flex';
    painel.innerHTML = `<span>Filtrar:</span><button class="btn active" id="btn-todos">Mostrar Todos</button>`;
    painel.firstChild.nextSibling.addEventListener('click', (e) => callbackFiltro('todos', e.target));
    
    autores.forEach(aut => {
        const div = document.createElement('div');
        div.className = 'filter-group';
        div.innerHTML = `<button class="btn">${aut.name}</button><button class="btn-del" data-type="authors" data-id="${aut.id}">❌</button>`;
        div.firstChild.addEventListener('click', (e) => callbackFiltro(aut.name, e.target));
        painel.appendChild(div);
    });
}

export function preencherSelect(autores) {
    const select = document.getElementById('artigo-autor');
    select.innerHTML = '<option value="">Autor...</option>' + autores.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
}