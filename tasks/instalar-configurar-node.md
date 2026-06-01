# Instalar e configurar Node.js, npm e PostgreSQL no Windows e Linux

Este guia reúne os passos principais para preparar o ambiente com Node.js, npm e PostgreSQL tanto no Windows quanto no Linux, usando uma estrutura simples e adequada para desenvolvimento e preparação de servidores. [docs.npmjs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

## Ordem recomendada

1. Instalar Node.js.
2. Verificar o npm.
3. Instalar PostgreSQL.
4. Criar banco e usuário da aplicação.
5. Testar a conexão com Node.js.

***

## Windows

### 1. Instalar Node.js e npm

1. Acesse o site oficial do Node.js e baixe a versão **LTS**. [nodejs](https://nodejs.org/en/download)
2. Execute o instalador do Windows e siga as opções padrão. [learn.microsoft](https://learn.microsoft.com/pt-br/windows/dev-environment/javascript/nodejs-on-windows)
3. Ao terminar, abra o **Prompt de Comando** ou **PowerShell** e valide:

```bash
node -v
npm -v
```

Se ambos responderem com número de versão, a instalação foi concluída corretamente. [docs.npmjs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

### 2. Instalar PostgreSQL

1. Baixe o instalador oficial do PostgreSQL para Windows.
2. Durante a instalação:
   - defina a senha do usuário `postgres`;
   - mantenha a porta padrão `5432`, salvo necessidade diferente;
   - instale o pgAdmin se quiser uma interface visual.
3. Ao final, abra o pgAdmin ou o terminal `psql` para validar que o serviço está funcionando.

### 3. Criar banco e usuário

Abra o `psql` ou use o Query Tool do pgAdmin e execute:

```sql
CREATE DATABASE netz_payload;
CREATE USER netz_user WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE netz_payload TO netz_user;
```

Esse processo cria um banco dedicado ao projeto e um usuário próprio para a aplicação, o que é mais organizado e seguro do que usar o usuário padrão `postgres` diretamente. [luiztools.com](https://www.luiztools.com.br/post/como-usar-nodejs-postgresql/)

### 4. Criar projeto Node para teste

No terminal:

```bash
mkdir teste-node-postgres
cd teste-node-postgres
npm init -y
npm install pg
```

O pacote `pg` é o cliente PostgreSQL mais usado no ecossistema Node.js para conexões simples e aplicações backend. [npmjs](https://www.npmjs.com/package/pg)

### 5. Testar conexão com PostgreSQL

Crie um arquivo chamado `test-db.js` com o conteúdo abaixo:

```js
const { Client } = require('pg')

async function main() {
  const client = new Client({
    host: 'localhost',
    user: 'netz_user',
    password: 'sua_senha_forte',
    database: 'netz_payload',
    port: 5432,
  })

  await client.connect()
  const result = await client.query('SELECT NOW()')
  console.log(result.rows[0])
  await client.end()
}

main().catch(console.error)
```

Depois execute:

```bash
node test-db.js
```

Se aparecer a data e hora retornada pelo banco, a conexão está funcionando. [luiztools.com](https://www.luiztools.com.br/post/como-usar-nodejs-postgresql/)

***

## Linux (Ubuntu/Debian)

### 1. Atualizar o sistema

Antes de instalar qualquer pacote, atualize o sistema:

```bash
sudo apt update
sudo apt upgrade -y
```

Esse passo reduz a chance de conflitos de dependências e mantém o ambiente preparado para produção. [todasolucao.com](https://todasolucao.com.br/tutoriais/nodejs-com-postgresql-setup-completo-na-nuvem)

### 2. Instalar Node.js e npm

No Linux, o Node.js pode ser instalado com base no gerenciador da distribuição ou usando um método recomendado para obter versões LTS mais atuais. [docs.npmjs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

Após a instalação, valide:

```bash
node -v
npm -v
```

Se os comandos responderem corretamente, o ambiente JavaScript está pronto. [docs.npmjs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

### 3. Instalar PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib -y
```

Depois valide se o serviço está ativo:

```bash
sudo systemctl status postgresql
```

### 4. Criar banco e usuário

Acesse o console do PostgreSQL:

```bash
sudo -u postgres psql
```

Depois execute:

```sql
CREATE DATABASE netz_payload;
CREATE USER netz_user WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE netz_payload TO netz_user;
\q
```

Esse padrão prepara o banco para uso pela aplicação Node sem depender do usuário administrador padrão do PostgreSQL. [ovhcloud](https://www.ovhcloud.com/pt/community/tutorials/how-to-acces-pg-nodejs-app/)

### 5. Criar projeto Node para teste

```bash
mkdir teste-node-postgres
cd teste-node-postgres
npm init -y
npm install pg
```

### 6. Testar a conexão

Crie o arquivo `test-db.js`:

```js
const { Client } = require('pg')

async function main() {
  const client = new Client({
    host: 'localhost',
    user: 'netz_user',
    password: 'sua_senha_forte',
    database: 'netz_payload',
    port: 5432,
  })

  await client.connect()
  const result = await client.query('SELECT NOW()')
  console.log(result.rows[0])
  await client.end()
}

main().catch(console.error)
```

Execute:

```bash
node test-db.js
```

Se a consulta retornar a data atual do banco, a instalação está correta e o ambiente está pronto para receber o projeto. [npmjs](https://www.npmjs.com/package/pg)

***

## Boas práticas iniciais

- Use a versão **LTS** do Node.js para ter mais estabilidade no projeto. [nodejs](https://nodejs.org/en/download)
- Não use o usuário `postgres` diretamente na aplicação; prefira um usuário dedicado. [ovhcloud](https://www.ovhcloud.com/pt/community/tutorials/how-to-acces-pg-nodejs-app/)
- Não coloque senha e credenciais fixas no código de produção; use variáveis de ambiente como `DATABASE_URL`. [todasolucao.com](https://todasolucao.com.br/tutoriais/nodejs-com-postgresql-setup-completo-na-nuvem)
- Mantenha o PostgreSQL escutando apenas localmente se a aplicação estiver na mesma VPS, reduzindo exposição desnecessária.

## Próximo passo

Depois de validar Node.js, npm e PostgreSQL, o próximo passo natural é criar o projeto Payload CMS e configurar a conexão com o banco usando o adapter PostgreSQL do Payload. [luiztools.com](https://www.luiztools.com.br/post/como-usar-nodejs-postgresql/)