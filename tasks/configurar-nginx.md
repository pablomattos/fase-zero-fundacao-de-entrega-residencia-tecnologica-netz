# Como configurar Nginx como reverse proxy para a aplicação Node.js

Este documento mostra, de forma prática, como colocar o Nginx na frente de uma aplicação Node.js para receber as requisições do domínio e encaminhá-las para a porta interna da aplicação. Em produção, usar Express atrás de um reverse proxy é uma prática recomendada, e o Express também orienta ajustar a configuração de `trust proxy` quando a aplicação estiver atrás de um proxy reverso. [expressjs](https://expressjs.com/en/guide/behind-proxies/)

## Pré-requisitos

Antes de começar, você precisa ter:

- uma VPS Linux com acesso SSH;
- Node.js e npm já instalados;
- a aplicação Node.js funcionando localmente no servidor, por exemplo em `http://127.0.0.1:3000`;
- Nginx instalado ou pronto para instalar;
- domínio apontando para o IP da VPS, se quiser acessar por domínio. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

## Objetivo

A configuração final ficará assim:

1. O usuário acessa `http://seudominio.com`.
2. O Nginx recebe a requisição na porta 80.
3. O Nginx encaminha a requisição para a aplicação Node.js rodando em `127.0.0.1:3000`.
4. A resposta volta pelo Nginx para o navegador. [blog.logrocket](https://blog.logrocket.com/how-to-run-node-js-server-nginx/)

***

## 1. Confirmar que a aplicação Node.js está rodando

Antes de configurar o Nginx, valide que a aplicação já está respondendo localmente no servidor. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)

```bash
curl http://127.0.0.1:3000
```

Se a aplicação ainda não estiver sendo mantida em execução contínua, use um gerenciador de processos como PM2:

```bash
pm2 start app.js --name meu-app
pm2 save
pm2 startup
```

Se o `curl` retornar resposta, a aplicação está pronta para ficar atrás do proxy. [blog.logrocket](https://blog.logrocket.com/how-to-run-node-js-server-nginx/)

***

## 2. Instalar o Nginx

Se o Nginx ainda não estiver instalado:

```bash
sudo apt update
sudo apt install nginx -y
```

Depois verifique o status:

```bash
sudo systemctl status nginx
```

Se o serviço estiver ativo, você já pode seguir para a configuração. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

***

## 3. Liberar HTTP no firewall

Se você usa UFW, libere SSH e HTTP:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw status
```

Isso garante acesso ao servidor por SSH e ao site pela porta 80. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

***

## 4. Criar a configuração do site no Nginx

Crie um novo arquivo para sua aplicação:

```bash
sudo nano /etc/nginx/sites-available/meu-app
```

Cole o conteúdo abaixo e ajuste o domínio e a porta, se necessário:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Essa configuração faz o Nginx receber o tráfego público e repassar tudo para a aplicação Node.js rodando em `127.0.0.1:3000`. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)

### O que esse bloco faz

- `listen 80`: escuta requisições HTTP.
- `server_name`: define quais domínios o bloco atende.
- `proxy_pass`: aponta para a aplicação Node.js.
- `proxy_set_header Host $host`: preserva o host original.
- `X-Forwarded-For` e `X-Forwarded-Proto`: enviam IP real e protocolo original para a aplicação. [expressjs](https://expressjs.com/en/guide/behind-proxies/)

***

## 5. Ativar a configuração

Crie o link simbólico para ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/meu-app /etc/nginx/sites-enabled/
```

Se quiser evitar conflito com o site padrão do Nginx:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Esse passo faz o Nginx carregar sua configuração personalizada na inicialização. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

***

## 6. Testar a sintaxe do Nginx

Antes de recarregar o serviço, valide a configuração:

```bash
sudo nginx -t
```

Se aparecer `syntax is ok` e `test is successful`, o arquivo está correto. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)

***

## 7. Recarregar o Nginx

Aplique a nova configuração:

```bash
sudo systemctl reload nginx
```

Se precisar reiniciar completamente:

```bash
sudo systemctl restart nginx
```

Depois disso, o proxy reverso já deve estar ativo. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

***

## 8. Testar no navegador

Abra no navegador:

```text
http://seudominio.com
```

Se tudo estiver certo, você verá a aplicação Node.js por meio do Nginx, mesmo que ela continue rodando apenas localmente na porta `3000`. [blog.logrocket](https://blog.logrocket.com/how-to-run-node-js-server-nginx/)

Você também pode testar com:

```bash
curl -I http://seudominio.com
```

***

## 9. Ajustar Express para confiar no proxy

Se você usa Express, configure a aplicação para confiar no proxy reverso:

```js
app.set('trust proxy', 1)
```

O Express documenta esse ajuste para que a aplicação leia corretamente os cabeçalhos `X-Forwarded-*`, como IP real do cliente e protocolo usado antes do proxy. [docsearch-expressjs.netlify](https://docsearch-expressjs.netlify.app/en/guide/behind-proxies.html)

***

## 10. Erros comuns

### 502 Bad Gateway

Esse erro normalmente indica que o Nginx não conseguiu alcançar a aplicação Node.js. Verifique se ela está rodando na porta correta e se o `proxy_pass` aponta para o endereço certo. [stackoverflow](https://stackoverflow.com/questions/75820301/how-to-configure-nginx-reverse-proxy-to-nodejs-app)

### Domínio não abre

Verifique se o DNS está apontando para o IP da VPS e se a porta 80 está liberada no firewall. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

### Nginx não recarrega

Normalmente há erro de sintaxe no arquivo de configuração. Sempre rode `sudo nginx -t` antes de aplicar as mudanças. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)

***

## 11. Boa prática extra

Em produção, mantenha a aplicação Node.js escutando apenas em `127.0.0.1` ou `localhost`, e exponha publicamente apenas o Nginx. Isso reduz a superfície de exposição e centraliza o tráfego externo no proxy reverso. [expressjs](https://expressjs.com/en/guide/behind-proxies/)

Se quiser, posso tentar novamente gerar e compartilhar o arquivo quando o ambiente permitir escrita.