export const BASE_URL = 'http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io';

export const buscarArtigos = () => fetch(`${BASE_URL}/api/articles?populate=*`).then(r => r.json()).then(res => res.data);
export const buscarAutores = () => fetch(`${BASE_URL}/api/authors?populate=*`).then(r => r.json()).then(res => res.data);

export async function criarItem(rota, formData) {
    const r = await fetch(`${BASE_URL}/api/${rota}`, { method: 'POST', body: formData });
    if (!r.ok) throw new Error(`Erro ao criar em ${rota}`);
    return await r.json(); // Adicionado o await aqui para segurar a resposta
}

export async function deletarItem(rota, id) {
    const r = await fetch(`${BASE_URL}/api/${rota}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`Erro ao deletar id ${id} de ${rota}`);
    return true;
}