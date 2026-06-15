import { buscarArtigos, buscarAutores, criarItem, deletarItem } from './api.js';
import { renderizarCards, configurarFiltros, preencherSelect } from './dom.js';

let artigos = [], autores = [], autorAtivo = 'todos';
const status = document.getElementById('status'), busca = document.getElementById('search-input');

async function iniciar() {
    try {
        artigos = await buscarArtigos(); autores = await buscarAutores();
        status.innerText = `Status: OK (${artigos.length} artigos / ${autores.length} autores)`;
        filtrarEEnviar(); configurarFiltros(artigos, autores, (nome, btn) => {
            document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active'); autorAtivo = nome; filtrarEEnviar();
        });
        preencherSelect(autores);
    } catch (e) { status.innerText = 'Erro: ' + e.message; }
}

function filtrarEEnviar() {
    const termo = busca.value.toLowerCase();
    const filtrados = artigos.filter(a => {
        const correspondeAutor = autorAtivo === 'todos' || a.author?.name === autorAtivo;
        const tit = (a.title || '').toLowerCase(); const aut = (a.author?.name || '').toLowerCase();
        return correspondeAutor && (tit.includes(termo) || aut.includes(termo));
    });
    renderizarCards(filtrados);
}

busca.addEventListener('input', filtrarEEnviar);

document.getElementById('form-autor').addEventListener('submit', async (e) => {
    e.preventDefault(); const inputs = e.target.querySelectorAll('input');
    const nome = inputs[0]?.value.trim(), email = inputs[1]?.value.trim(), avatar = inputs[2]?.files[0];
    if (!nome || !email) return alert('Preencha os campos de texto!');
    try {
        const res = await fetch('http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io/api/authors', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { name: nome, email: email } })
        });
        const corpo = await res.json(); if (!res.ok) throw new Error(corpo.error?.message || 'Erro');
        if (avatar && corpo.data?.id) {
            const fd = new FormData(); fd.append('files', avatar);
            fd.append('ref', 'api::author.author'); fd.append('refId', corpo.data.id); fd.append('field', 'avatar');
            await fetch('http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io/api/upload', { method: 'POST', body: fd });
        }
        e.target.reset(); await iniciar();
    } catch (err) { alert('Erro no Strapi: ' + err.message); }
});

document.getElementById('form-artigo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tituloInput = document.getElementById('artigo-titulo') || e.target.querySelector('input[type="text"]');
    const descricaoTextarea = document.getElementById('artigo-descricao') || e.target.querySelector('textarea');
    const selectAutor = e.target.querySelector('select');
    const coverFile = document.getElementById('artigo-cover')?.files[0] || e.target.querySelector('input[type="file"]')?.files[0];

    const payload = {
        data: {
            title: tituloInput?.value.trim(),
            description: descricaoTextarea?.value.trim(),
            category: 1, // Associa ao ID de uma categoria existente no seu Strapi
            author: selectAutor && selectAutor.value ? Number(selectAutor.value) : null
        }
    };

    try {
        const res = await fetch('http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io/api/articles', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const corpo = await res.json(); if (!res.ok) throw new Error(corpo.error?.message || 'Erro ao criar');
        if (coverFile && corpo.data?.id) {
            const fd = new FormData(); fd.append('files', coverFile);
            fd.append('ref', 'api::article.article'); fd.append('refId', corpo.data.id); fd.append('field', 'cover');
            await fetch('http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io/api/upload', { method: 'POST', body: fd });
        }
        e.target.reset(); await iniciar();
    } catch (err) { alert('Erro ao publicar artigo: ' + err.message); }
});

document.body.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-del') && confirm('Confirmar exclusão?')) {
        await deletarItem(e.target.dataset.type, e.target.dataset.id); await iniciar();
    }
});
iniciar();