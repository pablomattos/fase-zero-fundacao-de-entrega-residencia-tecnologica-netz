const container = document.getElementById('dados-container');
const painelControles = document.getElementById('controls-panel');

// Desenha os cards dos artigos na tela
export function renderizarCards(artigos) {
    if (artigos.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; color: #666;">Nenhum artigo encontrado.</p>`;
        return;
    }

    container.innerHTML = artigos.map(artigo => {
        const titulo = artigo.title || 'Sem título';
        const descricao = artigo.description || 'Sem conteúdo.';
        const id = artigo.id;
        const categoria = artigo.category?.name || 'Geral';
        const autor = artigo.author?.name || 'Equipe Netz';

        return `
            <div class="card">
                <div>
                    <div class="meta-container">
                        <span class="badge">${categoria}</span>
                        <span class="post-id">#ID: ${id}</span>
                    </div>
                    <h3>${titulo}</h3>
                    <p class="description-text">${descricao}</p>
                </div>
                <div class="author-box">
                    <span>Por:</span>
                    <span class="author-name">${autor}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Cria os botões de filtro por autor no topo
export function configurarBotoesFiltro(artigos, btnTodos, callbackFiltro) {
    painelControles.style.display = 'flex';
    const autoresUnicos = [...new Set(artigos.map(a => a.author?.name).filter(Boolean))];

    // Limpa o painel e reinsere o botão principal
    painelControles.innerHTML = `<span>Trocar por Autor:</span>`;
    painelControles.appendChild(btnTodos);

    autoresUnicos.forEach(nomeAutor => {
        const botao = document.createElement('button');
        botao.className = 'btn';
        botao.innerText = nomeAutor;
        botao.addEventListener('click', (e) => callbackFiltro(nomeAutor, e.target));
        painelControles.appendChild(botao);
    });
}