
---

# Tarefa: Implementar Schema Base (Payload CMS)

## 📌 Contexto e Objetivo

Esta tarefa consiste em traduzir os requisitos de conteúdo do **Portal de Parcerias Netz** em estruturas de dados reais dentro do Payload CMS (chamadas de *Collections* e *Globals*).

Como esta fase é a fundação para os futuros desenvolvedores e para a IA que gerará os sites, o schema precisa ser limpo, tipado e semanticamente correto. A IA utilizará essa exata estrutura para injetar o conteúdo mapeado a partir dos briefings das agências.

---

## 🛠️ O que deve ser construído (Estrutura do Schema)

O Payload CMS divide as estruturas em **Collections** (para dados repetíveis, como páginas e imagens) e **Globals** (para dados únicos no site todo, como configurações e cabeçalhos).

### 1. Mídia (`Media` Collection)

Responsável pelo upload e armazenamento de imagens, logotipos e vetores que serão usados nas páginas.

* **Campos principais:**
* `url` / `filename` (gerados automaticamente pelo Payload para upload de arquivos).
* `alt` (Texto Alternativo): Campo de texto obrigatório para garantir a **acessibilidade (WCAG)**, conforme os requisitos da Fase 0.



### 2. Páginas (`Pages` Collection)

A estrutura dinâmica que permitirá criar qualquer página do site (Home, Sobre, Contato, etc.).

* **Campos principais:**
* `title` (Texto): Título interno da página.
* `slug` (Texto): A URL da página (ex: `home`, `contato`). Deve ser gerada automaticamente ou validada para evitar caracteres inválidos.
* `layout` (Blocks): Array de blocos dinâmicos (ex: Bloco Hero, Bloco de Recursos, Bloco de Galeria). Isso permite que a IA monte a página combinando diferentes seções.



### 3. Configurações do Site (`SiteSettings` Global)

Uma estrutura global (única) para armazenar informações que se repetem em todo o ecossistema do site do cliente final.

* **Campos principais:**
* `siteName` (Texto): Nome da empresa/site.
* `logo` (Relacionamento): Vínculo com a coleção de `Media` para puxar a logo oficial.
* `footerText` (Rich Text): Texto de copyright ou informações de rodapé.



### 4. SEO Global (`Seo` Global ou Grupo de Campos)

Configurações de metadados para indexação nos motores de busca, essenciais para cumprir o **Checklist de SEO Técnico** do projeto. Pode ser um Global independente ou um grupo de campos reaproveitável dentro de cada página.

* **Campos principais:**
* `metaTitle` (Texto): Título que aparece na aba do navegador e no Google (máx. 60 caracteres).
* `metaDescription` (Textarea): Descrição resumida da página para os resultados de busca (máx. 160 caracteres).
* `ogImage` (Relacionamento): Imagem de compartilhamento para redes sociais (Open Graph), vinculada à coleção de `Media`.



---

## 💻 Exemplo Prático de Implementação (Código Técnico)

No Payload CMS, essas configurações são feitas usando arquivos TypeScript (`.ts`). Abaixo está um exemplo conceitual de como deve ficar a estrutura do arquivo `Pages.ts`:

```typescript
import { CollectionConfig } from 'payload/types';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    // Grupo de Campos de SEO acoplado à página
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
      ],
    },
  ],
};

```

---

## ⚠️ Critérios de Aceite para dar a Tarefa como Concluída

Para mover esta tarefa para *Done* no Kanban, certifique-se de que:

1. [ ] Todas as collections (`pages`, `media`) e globals (`site-settings`) aparecem no painel administrativo do Payload.
2. [ ] É possível fazer o upload de uma imagem e preencher o texto `alt` obrigatório.
3. [ ] O campo `slug` de páginas impede a criação de URLs duplicadas.
4. [ ] O banco de dados PostgreSQL refletiu as novas tabelas e colunas sem gerar erros de migração.