import { buscarArtigosDaAPI } from './api.js';
import { renderizarCards, configurarBotoesFiltro } from './dom.js';

let todosOsArtigos = [];

const statusText = document.getElementById('status');
const btnTodos = document.getElementById('btn-todos');

// Configura o clique do botão inicial "Mostrar Todos"
btnTodos.addEventListener('click', (e) => filtrarAutor('todos', e.target));

async function iniciarApp() {
    try {
        todosOsArtigos = await buscarArtigosDaAPI();

        if (todosOsArtigos.length === 0) {
            statusText.innerText = "Status: Conectado! Nenhum artigo encontrado.";
            return;
        }

        statusText.innerText = `Status: Sucesso! ${todosOsArtigos.length} artigo(s) carregado(s).`;
        
        configurarBotoesFiltro(todosOsArtigos, btnTodos, filtrarAutor);
        renderizarCards(todosOsArtigos);

    } catch (erro) {
        statusText.innerText = 'Erro: ' + erro.message;
        statusText.style.backgroundColor = '#ffe3e3';
        statusText.style.color = 'red';
    }
}

function filtrarAutor(nomeAutor, botaoClicado) {
    const botoes = document.querySelectorAll('.btn');
    botoes.forEach(b => b.classList.remove('active'));
    if (botaoClicado) botaoClicado.classList.add('active');

    const filtrados = nomeAutor === 'todos' 
        ? todosOsArtigos 
        : todosOsArtigos.filter(a => a.author?.name === nomeAutor);
        
    renderizarCards(filtrados);
}

// Inicializa o sistema
iniciarApp();