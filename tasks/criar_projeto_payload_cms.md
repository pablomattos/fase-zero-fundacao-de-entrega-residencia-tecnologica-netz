# 🚀 Payload CMS — Setup Inicial & Estrutura Profissional

> Guia completo para criar um projeto com <strong>Payload CMS + Next.js + PostgreSQL</strong>, incluindo:
>
> * configuração inicial;
> * estrutura de pastas;
> * collections;
> * globals;
> * TypeScript;
> * deploy em VPS;
> * boas práticas de arquitetura.

---

# 📋 Pré-requisitos

Antes de começar, instale:

* Node.js 20+
* Git
* PostgreSQL
* pnpm (recomendado)

## 🔗 Documentação Oficial

* [Payload CMS Documentation](https://payloadcms.com/docs/getting-started/installation?utm_source=chatgpt.com)
* [Payload CMS Quickstart](https://payloadcms.com/get-started?utm_source=chatgpt.com)

---

# 📦 1. Criar o Projeto

## Criar pasta do projeto

```bash
mkdir netz-payload
cd netz-payload
```

## Inicializar Git e package.json

```bash
git init
npm init -y
```

## Configurar ESM (Opcional)

Edite o `package.json`:

```json
{
  "type": "module"
}
```

---

# ⚙️ 2. Criar Projeto Base do Payload

Execute o scaffolder oficial:

```bash
npx create-payload-app
```

Depois escolha:

* template desejado;
* integração com Next.js;
* TypeScript;
* banco de dados.

## Instalar dependências

```bash
pnpm install
```

---

# 🧩 3. Instalar Dependências Principais

## Dependências do projeto

```bash
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp graphql
```

## Dependências TypeScript

```bash
pnpm add -D typescript ts-node
```

## 📌 Explicação

| Dependência                    | Função                   |
| ------------------------------ | ------------------------ |
| `payload`                      | Core do CMS              |
| `@payloadcms/next`             | Integração Next.js       |
| `@payloadcms/db-postgres`      | Adapter PostgreSQL       |
| `@payloadcms/richtext-lexical` | Editor rich text         |
| `sharp`                        | Processamento de imagens |
| `graphql`                      | API GraphQL              |

---

# 🗂️ 4. Estrutura de Pastas

Estrutura recomendada:

```txt
project-root/
├─ app/
│  ├─ (payload)/
│  └─ (frontend)/
│
├─ src/
│  ├─ collections/
│  │  ├─ Pages.ts
│  │  ├─ Media.ts
│  │  └─ Users.ts
│  │
│  ├─ globals/
│  │  ├─ SiteSettings.ts
│  │  └─ SEO.ts
│  │
│  ├─ blocks/
│  │  ├─ Hero.ts
│  │  └─ CTA.ts
│  │
│  ├─ fields/
│  │  ├─ slug.ts
│  │  └─ seoFields.ts
│  │
│  ├─ hooks/
│  │  ├─ formatSlug.ts
│  │  └─ revalidatePage.ts
│  │
│  ├─ access/
│  │  └─ isAdmin.ts
│  │
│  ├─ lib/
│  │  └─ env.ts
│  │
│  └─ payload-types.ts
│
├─ public/
├─ .env
├─ package.json
├─ tsconfig.json
├─ next.config.mjs
└─ payload.config.ts
```

## ✅ Benefícios dessa estrutura

* separação por responsabilidade;
* manutenção simplificada;
* escalabilidade;
* arquitetura code-first;
* melhor organização do domínio.

---

# 🔧 5. Criar `payload.config.ts`

Crie o arquivo na raiz do projeto:

```ts
import path from 'path'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { Pages } from './src/collections/Pages'
import { Media } from './src/collections/Media'
import { SiteSettings } from './src/globals/SiteSettings'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'change-me',

  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000',

  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL || '',
    },
  }),

  collections: [Pages, Media],

  globals: [SiteSettings],

  typescript: {
    outputFile: path.resolve(
      './src/payload-types.ts',
    ),
  },
})
```

## ⚠️ Importante

Configure corretamente:

* `PAYLOAD_SECRET`
* `DATABASE_URL`

---

# 📄 6. Criar Collections e Globals

---

## Collection: `Pages.ts`

`src/collections/Pages.ts`

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
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

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',

      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
    },

    {
      name: 'content',
      type: 'richText',
    },
  ],

  timestamps: true,
}
```

---

## Global: `SiteSettings.ts`

`src/globals/SiteSettings.ts`

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',

  label: 'Configurações do Site',

  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },

    {
      name: 'siteDescription',
      type: 'textarea',
    },
  ],
}
```

---

# 🧠 7. Configurar Next.js e TypeScript

## next.config.mjs

```ts
import { withPayload }
  from '@payloadcms/next/withPayload'

const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig)
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": [
        "./payload.config.ts"
      ]
    }
  }
}
```

---

# 🔐 8. Variáveis de Ambiente

Crie o arquivo `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/netz_payload

PAYLOAD_SECRET=uma-chave-segura-aqui

NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## ⚠️ Segurança

Adicione `.env` no `.gitignore`.

---

# ▶️ 9. Rodar o Projeto

## Ambiente de desenvolvimento

```bash
pnpm dev
```

ou:

```bash
npm run dev
```

---

## Painel Admin

Acesse:

```txt
http://localhost:3000/admin
```

---

# 🐘 10. Configurar PostgreSQL

## Criar banco e usuário

```sql
CREATE DATABASE netz_payload;

CREATE USER netz_user
WITH PASSWORD 'usuario';

GRANT ALL PRIVILEGES
ON DATABASE netz_payload
TO netz_user;
```

---

## Atualizar `.env`

```env
DATABASE_URL=postgresql://netz_user:senha@localhost:5432/netz_payload
```

---

# 🧱 11. Organização Avançada

## Fields reutilizáveis

Use:

```txt
src/fields
```

Para:

* SEO;
* slug;
* metadata;
* reusable fields.

---

## Blocks

Use:

```txt
src/blocks
```

Para:

* Hero sections;
* CTA;
* layouts;
* content builders.

---

## Hooks

Use:

```txt
src/hooks
```

Para:

* geração automática de slug;
* sanitização;
* revalidation;
* cache invalidation.

---

## Access Control

Use:

```txt
src/access
```

Para:

* permissões;
* autenticação;
* ACL;
* RBAC.

---

# ☁️ 12. Deploy em VPS

## Checklist inicial

### Servidor

* Ubuntu 22.04
* SSH configurado
* chave pública instalada

---

### Instalar dependências

* Node.js
* PostgreSQL
* Nginx
* PM2

---

### Configurar Reverse Proxy

Nginx → porta `3000`

---

### HTTPS

Configure:

* Certbot
* TLS
* redirecionamento HTTP → HTTPS

---

# 📚 13. Boas Práticas

## ✅ Code-first CMS

Versione:

* collections;
* globals;
* hooks;
* fields;
* access control.

---

## ✅ Type Safety

Gere automaticamente:

```txt
payload-types.ts
```

E use no frontend.

---

## ✅ Testes

Escreva testes para:

* hooks;
* access;
* validações;
* seeds.

---

## ✅ Revalidation

Documente:

* ISR;
* webhooks;
* cache invalidation;
* rebuild automático.

---

# 🔗 Referências

* [Payload CMS Docs](https://payloadcms.com/docs?utm_source=chatgpt.com)
* [Payload Configuration Overview](https://payloadcms.com/docs/configuration/overview?utm_source=chatgpt.com)
* [Payload Globals Documentation](https://payloadcms.com/docs/configuration/globals?utm_source=chatgpt.com)
* [Payload Admin Panel Docs](https://payloadcms.com/docs/admin/overview?utm_source=chatgpt.com)
* [DigitalOcean PostgreSQL Guide](https://www.digitalocean.com/community/tutorials/how-to-use-roles-and-manage-grant-permissions-in-postgresql-on-a-vps-2?utm_source=chatgpt.com)
* [DigitalOcean Node.js VPS Deploy Guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04?utm_source=chatgpt.com)

---

# 🎯 Próximos Passos

Você pode expandir este projeto adicionando:

* autenticação JWT;
* multi-tenant;
* upload de mídia;
* SEO avançado;
* editor visual;
* webhooks;
* ISR automático;
* Docker;
* CI/CD;
* integração com frontend React/Next.

---

# 🏁 Resultado

Ao final deste setup você terá:

* Payload CMS profissional;
* arquitetura escalável;
* integração Next.js;
* PostgreSQL configurado;
* TypeScript;
* base pronta para produção.
