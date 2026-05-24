# PostgreSQL Básico — Guia Prático

---

# 1. O que é PostgreSQL

PostgreSQL é um sistema gerenciador de banco de dados relacional (SGBD) open source, robusto e confiável, usado para armazenar dados relacionais com suporte a transações, índices, integridade e extensões.

Na prática, isso significa que você pode usar PostgreSQL para armazenar contas, registros de aplicações, logs estruturados, e servir dados para APIs e aplicações web com consistência e desempenho.

---

# 2. Por que aprender PostgreSQL

Saber PostgreSQL permite projetar esquemas de dados coerentes, garantir integridade transacional, otimizar consultas e integrar o banco com aplicações (por exemplo, Node.js).

No uso real, um design de banco correto e conhecimento de permissões/backup/monitoramento reduzem falhas em produção e facilitam escalar a aplicação.

---

# 3. Instalação e início do serviço (resumo prático)

Instalar o servidor prepara o ambiente para aceitar conexões locais e remotas; em Linux (Debian/Ubuntu) isso costuma ser feito com `apt` e o serviço inicia via `systemd`.

## Exemplo prático

Após instalar, verifique o status com:

```bash
sudo systemctl status postgresql
```

Confirme que o daemon está escutando na porta `5432`.

---

# 4. Criar database e conectar (psql)

Um database é o contêiner lógico para schemas e tabelas; criar um DB isola dados de projetos diferentes.

## Comandos básicos

### Entrar no cliente psql (Linux)

```bash
sudo -u postgres psql
```

### Criar DB

```sql
CREATE DATABASE myapp_db;
```

### Conectar

```sql
\c myapp_db
```

## Exemplo prático

Crie `myapp_db` para seu projeto e conecte-se para criar tabelas.

---

# 5. Criar tabela básica

Tabelas armazenam registros em colunas tipadas; escolha tipos coerentes para consultas e índices.

## Exemplo de tabela users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

Na prática, essa tabela guarda usuários de uma API e serve para autenticação e perfis.

---

# 6. Roles (usuários) e permissões básicas

Roles representam usuários ou grupos; privilégios como `CONNECT`, `USAGE`, `SELECT`, `INSERT`, `UPDATE` e `DELETE` controlam acesso.

## Exemplo prático

```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'senhaForte';

GRANT CONNECT ON DATABASE myapp_db TO app_user;

GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO app_user;
```

Na prática, a aplicação em produção usa um usuário com privilégios mínimos (princípio do menor privilégio) para reduzir risco.

---

# 7. Configuração de acesso e segurança básica (pg_hba.conf)

`pg_hba.conf` define:

- Quem pode conectar
- De quais IPs
- Qual método de autenticação será usado

Métodos comuns:

- `peer`
- `md5`
- `scram-sha-256`
- `trust`

## Exemplo real

Para permitir conexões da sua aplicação em outro host, adicione uma linha com o IP/máscara e método `md5` e reinicie o serviço:

```bash
sudo systemctl restart postgresql
```

Proteja credenciais usando variáveis de ambiente ou secrets manager.

---

# 8. Conexão via Node.js (node-postgres / pg)

`node-postgres` (`pg`) é a biblioteca popular para Node.js; usar `Pool` é recomendado para gerenciar conexões.

## Exemplo de configuração (db.js)

```js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'app_user',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'myapp_db',
  password: process.env.PGPASSWORD || 'senhaForte',
  port: process.env.PGPORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

---

## Teste prático (test-conn.js)

```js
const db = require('./db');

(async () => {
  const res = await db.query('SELECT NOW()');

  console.log(res.rows);

  await db.pool.end();
})();
```

## Na prática

Crie `db.js`, `test-conn.js` e rode:

```bash
node test-conn.js
```

para validar a conexão.

---

# 9. Operações CRUD via Node.js (queries parametrizadas)

Use parâmetros (`$1`, `$2`, ...) para evitar SQL injection.

## Exemplo de INSERT parametrizado

```js
const text = `
  INSERT INTO users
  (username, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id
`;

const values = [
  'pablo',
  'pablo@example.com',
  'hash'
];

const res = await db.query(text, values);
```

Na prática, endpoints `POST`, `GET`, `PUT` e `DELETE` usam essas queries parametrizadas para operar dados com segurança.

---

# 10. Migrations (introdução)

Migrations versionam alterações de esquema (criar/alterar tabelas) para sincronizar ambientes.

Ferramentas comuns:

- Sequelize CLI
- Knex
- Prisma Migrate
- Scripts SQL manuais

## Exemplo prático manual

Crie:

```text
001_create_users.sql
```

Conteúdo:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL
);
```

Aplicar migration:

```bash
psql -d myapp_db -f 001_create_users.sql
```

---

# 11. Monitoramento e manutenção simples

Manter o banco envolve:

- Checar conexões ativas
- Ver estatísticas
- Executar VACUUM/ANALYZE
- Fazer backups

## Comando útil para ver conexões

```sql
SELECT
  pid,
  usename,
  application_name,
  client_addr,
  state
FROM pg_stat_activity;
```

---

## Comando de manutenção

```sql
VACUUM ANALYZE;
```

Na prática, ao diagnosticar lentidão, observe `pg_stat_activity` e os logs para identificar queries longas e gargalos.

---

# 12. Backups e restauração básicos

Backups evitam perda de dados; use `pg_dump` para dumps lógicos e `pg_restore`/`psql` para restaurar.

## Exemplos práticos

### Criar backup

```bash
pg_dump -U postgres \
  -d myapp_db \
  -F c \
  -f myapp_db.backup
```

### Restaurar backup

```bash
pg_restore \
  -U postgres \
  -d target_db \
  myapp_db.backup
```

Na prática, gere dumps antes de alterações críticas e teste restaurações em ambiente de staging.

---

# 13. Boas práticas e checklist de segurança

- Não exponha o PostgreSQL sem restrição; limite acesso por `pg_hba.conf` e firewall.
- Use roles com privilégios mínimos para aplicações.
- Nunca deixe credenciais hardcoded; use variáveis de ambiente ou um secrets manager.
- Tenha rotina de backups e monitore métricas básicas:
  - conexões
  - uso de disco
  - queries lentas

Na prática, essas medidas reduzem riscos e facilitam recuperação em incidentes.

---

# 14. Fluxo de estudo recomendado (ordem prática)

1. Instalação e confirmar serviço.
2. Criar database e conectar (`psql`).
3. Criar tabelas básicas.
4. Criar role de aplicação e ajustar permissões.
5. Conectar via Node.js e testar `SELECT NOW()`.
6. Implementar CRUD básico com queries parametrizadas.
7. Aprender migrations e aplicar mudanças de esquema.
8. Testar backups e restore.
9. Monitoramento básico e manutenção.

---

# 15. Como praticar de verdade (rotina prática)

- Criar um DB de teste, criar a tabela `users` e inserir alguns registros.
- Criar `app_user`, conectar via Node.js e escrever scripts que façam `INSERT` e `SELECT`.
- Simular erro (ex.: remover permissão) e resolver (reconceder).
- Fazer `pg_dump` do DB e restaurar em outro nome.

Essa prática transforma o conhecimento em habilidade operacional.

---

# 16. Exemplo de fluxo real (pequeno caso completo)

## No servidor dev

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE myapp_db;

CREATE ROLE app_user
WITH LOGIN PASSWORD 'senha';

GRANT CONNECT ON DATABASE myapp_db TO app_user;
```

---

## Criar tabela users no myapp_db

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## No projeto Node

### Configurar db.js

Pool apontando para:

- `app_user`
- `myapp_db`

### Rodar script

- Inserir usuário
- Fazer `SELECT`
- Listar registros

---

## Monitorar execução

Checar:

```sql
SELECT * FROM pg_stat_activity;
```

Gerar um `pg_dump` ao final do processo.

---

# Resumo

PostgreSQL é uma das tecnologias mais importantes do backend moderno e fornece:

- Integridade
- Segurança
- Escalabilidade
- Performance
- Confiabilidade

Dominar PostgreSQL junto com Linux e Node.js fornece uma base sólida para:

- APIs
- Sistemas web
- Backend moderno
- Infraestrutura
- DevOps