```markdown
# Documentação Técnica: Implementação do Schema Base (CMS Headless)

Este documento detalha a estrutura, a modelagem de dados e as diretrizes de configuração do **Schema Base** implementado no ecossistema de gerenciamento de conteúdo (CMS Headless) da aplicação. Esta etapa consolida a transição de um front-end estático para uma aplicação dinâmica orientada a dados.

---

## 1. Visão Geral da Arquitetura

A arquitetura do projeto baseia-se no desacoplamento completo entre a camada de localização e gerenciamento de conteúdo (Back-end Headless via API) e a interface do usuário final (Front-end Dinâmico).


```

+------------------------------------+       REST API       +------------------------------------+
|         CMS HEADLESS INTERN        |    ------------->    |         FRONT-END APLICATIVO       |
|  (Conteúdos, Categorias, Autores)  |    <-------------    |   (Filtros Dinâmicos, Componentes) |
+------------------------------------+        (fetch)       +------------------------------------+

```

---

## 2. Processo de Configuração do Ambiente e Schema

A construção e a disponibilização do ecossistema de dados seguiram os seguintes passos de configuração técnica:

1. **Inicialização do Serviço:** O servidor do CMS Headless foi inicializado localmente a partir do ambiente de desenvolvimento por meio de comandos CLI em Node.js (`npm run develop`), ativando a porta padrão de escuta do sistema.
2. **Criação de Content-Types via Admin UI:** Utilizando o construtor de tipos de conteúdo (`Content-Type Builder`), foram injetadas as novas tabelas e atributos diretamente na interface visual, gerando automaticamente os arquivos de configuração JSON em segundo plano.
3. **Estabelecimento de Vinculações Lógicas:** No painel de edição de campos, foram configuradas as chaves estrangeiras virtuais que determinam os relacionamentos. Definiu-se que cada item da coleção principal obrigatoriamente aponta para uma única categoria e um único autor cadastrados.
4. **Configuração de Permissões de API (RBAC):** No menu de configurações de segurança (`Settings > Roles > Public`), foram liberadas de forma pública as permissões de leitura (`find` e `findOne`) para as novas coleções criadas, permitindo que o front-end realize requisições HTTP sem travas de CORS ou necessidade de tokens privados nesta fase de MVP.

---

## 3. Modelagem do Schema (Collections & Content Types)

Para suportar o ecossistema de conteúdo dinâmico do portal, foram modeladas coleções estruturadas interligadas por relacionamentos de integridade referencial.

### A. Collection Type: `Post` / `Article` (Publicações)
Entidade principal que armazena os conteúdos e páginas dinâmicas.

| Nome do Campo | Tipo de Dado | Restrições / Validações | Finalidade (SEO / Interface) |
| :--- | :--- | :--- | :--- |
| `title` | Text (Short) | Required, Unique | Exibição em cards, títulos e tag `<title>` do HTML. |
| `description` | Text (Long) | Required | Meta-description do SEO e resumos de interface. |
| `slug` | Slug | Target: `title` (UID) | URLs amigáveis e estruturação de rotas de SEO. |
| `cover` | Media (Single) | Allowed types: Images only | Banner e ativos visuais da publicação. |
| `category` | Relation | Many-to-One (com `Category`) | Filtros dinâmicos e indexação por tópicos. |
| `author` | Relation | Many-to-One (com `Author`) | Atribuição de autoria e relacionamento de entidades. |

### B. Collection Type: `Category` (Categorias)
Mapeia as verticais de conteúdo e agrupamentos lógicos do sistema.

* **Campos:**
    * `name` (Text Short): Nome visível e comercial da categoria no front-end. Required, Unique.
    * `slug` (Slug): Identificador seguro (string sem caracteres especiais) para filtragem via parâmetros de rota ou consultas na API.

### C. Collection Type: `Author` (Autores / Criadores)
Gerencia as informações dos criadores de conteúdo ou entidades parceiras.

* **Campos:**
    * `name` (Text Short): Nome de exibição do autor ou organização produtora. Required.

---

## 4. Configurações Globais de SEO e Mídia

O Schema Base foi planejado para atender nativamente aos requisitos de performance e otimização para motores de busca (SEO):

1. **Slugs Automatizados (URLs Amigáveis):** Configurados como campos do tipo `UID` indexados ao título da publicação. Eliminam automaticamente caracteres especiais, acentuações e espaços, gerando URLs otimizadas para indexação de rastreadores (e.g., Googlebot).
2. **Tratamento de Mídia Base:** O back-end realiza o armazenamento estruturado de metadados das imagens subidas (dimensões, formatos e tamanhos). O front-end consome as URLs absolutas geradas de forma dinâmica.
3. **Mapeamento de Meta-Tags:** Os campos estruturados de `title` e `description` fornecem diretamente os dados necessários para popular as tags Open Graph (`og:title`, `og:description`) e as meta-tags tradicionais do HTML de forma dinâmica via rotas do front-end.

---

## 5. Validação e Testes no Painel Administrativo (`/admin`)

A robustez e a integridade do Schema Base foram validadas no painel administrativo por meio de ciclos completos de CRUD (Create, Read, Update, Delete) com dados genéricos simulando o ambiente de produção:

* **Teste de Ciclo de Vida do Conteúdo:** Entradas foram criadas com status `Draft` (Rascunho) para validação dos campos obrigatórios e sanitização de dados.
* **Validação de Relacionamentos:** Testes de vínculo garantiram que a deleção ou edição de categorias e autores reflete corretamente nas consultas indexadas das publicações.
* **Homologação da API:** Verificação dos endpoints públicos (`/api/articles?populate=*`) para certificar que o payload JSON retorna a árvore completa de dados estruturados (mídias, autores e categorias).

```