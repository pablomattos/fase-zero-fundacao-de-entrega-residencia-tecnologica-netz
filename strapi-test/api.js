const URL_API = 'http://strapi-kbym0lfrkx0bfm32kjw2nn5w.89.116.28.148.sslip.io/api/articles?populate=*';

export async function buscarArtigosDaAPI() {
    const resposta = await fetch(URL_API);
    if (!resposta.ok) throw new Error('Erro na requisição ao Strapi.');
    
    const resultado = await resposta.json();
    return resultado.data; // Retorna direto a array de artigos
}