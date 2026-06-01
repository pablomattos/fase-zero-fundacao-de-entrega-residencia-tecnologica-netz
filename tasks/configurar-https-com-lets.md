# Como configurar HTTPS com Let's Encrypt e Certbot

Este guia mostra como ativar HTTPS em um servidor com Nginx usando **Let's Encrypt** e **Certbot**. O Certbot pode emitir o certificado, ajustar a configuração do Nginx e configurar a renovação automática dos certificados, que normalmente expiram em 90 dias. [help.time4vps](https://help.time4vps.com/en/articles/390216-ubuntu-let-s-encrypt-for-nginx)

## Pré-requisitos

Antes de começar, confirme estes pontos:

- o domínio já aponta para o IP público da VPS;
- o Nginx já está instalado e respondendo em HTTP;
- a porta 80 está acessível externamente;
- você tem acesso SSH com privilégios sudo. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

Se o domínio ainda não estiver apontando corretamente, a validação do certificado falhará. [kamatera](https://www.kamatera.com/knowledgebase/how-to-secure-nginx-with-lets-encrypt/)

***

## 1. Confirmar que o site responde em HTTP

Antes de emitir o certificado, teste se o domínio abre em HTTP:

```text
http://seudominio.com
```

Se o site abrir normalmente, o Nginx está pronto para o próximo passo. O fluxo recomendado pelas documentações é fazer o site funcionar em HTTP primeiro e só depois aplicar o HTTPS. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

***

## 2. Atualizar os pacotes do sistema

No servidor, atualize a lista de pacotes:

```bash
sudo apt update
```

Manter o sistema atualizado ajuda a evitar problemas de instalação e garante que o pacote do Certbot seja obtido corretamente. [hostnextra](https://hostnextra.com/learn/tutorials/install-certbot-on-ubuntu-with-nginx)

***

## 3. Instalar o Certbot com suporte ao Nginx

Instale o Certbot e o plugin do Nginx:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Esse plugin permite que o Certbot detecte a configuração do Nginx, emita o certificado e ajuste automaticamente os blocos do servidor para HTTPS. [hostnextra](https://hostnextra.com/learn/tutorials/install-certbot-on-ubuntu-with-nginx)

***

## 4. Ajustar o firewall

Se estiver usando UFW, permita tráfego HTTPS e mantenha HTTP liberado para validação e redirecionamento:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

O perfil `Nginx Full` libera as portas 80 e 443, usadas respectivamente para HTTP e HTTPS. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

Se você havia liberado apenas HTTP antes, pode trocar para o perfil completo. [help.time4vps](https://help.time4vps.com/en/articles/390216-ubuntu-let-s-encrypt-for-nginx)

***

## 5. Emitir o certificado SSL

Rode o Certbot informando o domínio principal e, se existir, o `www`:

```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

Durante a execução, o Certbot normalmente:

- valida o domínio;
- emite o certificado;
- modifica a configuração do Nginx;
- pergunta se você quer redirecionar automaticamente HTTP para HTTPS. [kamatera](https://www.kamatera.com/knowledgebase/how-to-secure-nginx-with-lets-encrypt/)

Quando o Certbot oferecer a opção de redirecionamento, a escolha mais comum em produção é redirecionar todo o tráfego HTTP para HTTPS. [kamatera](https://www.kamatera.com/knowledgebase/how-to-secure-nginx-with-lets-encrypt/)

***

## 6. Testar o HTTPS no navegador

Depois da emissão, abra:

```text
https://seudominio.com
```

Se tudo estiver certo, o navegador mostrará o cadeado de conexão segura e o site já estará servindo conteúdo por HTTPS. [help.time4vps](https://help.time4vps.com/en/articles/390216-ubuntu-let-s-encrypt-for-nginx)

Você também pode testar com:

```bash
curl -I https://seudominio.com
```

***

## 7. Verificar a configuração gerada no Nginx

Depois que o Certbot termina, ele normalmente altera automaticamente o bloco do Nginx para incluir o certificado e a chave privada. [kamatera](https://www.kamatera.com/knowledgebase/how-to-secure-nginx-with-lets-encrypt/)

Trechos comuns na configuração ficam assim:

```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
```

Esses arquivos são criados pelo Let's Encrypt e usados pelo Nginx para servir HTTPS. [gist.github](https://gist.github.com/naala89/779583999dcf125fa73b392d04599882)

Também é comum o Certbot criar um redirecionamento de HTTP para HTTPS no bloco da porta 80. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

***

## 8. Testar a renovação automática

Os certificados do Let's Encrypt expiram normalmente em 90 dias, então a renovação automática é parte importante da configuração. [help.time4vps](https://help.time4vps.com/en/articles/390216-ubuntu-let-s-encrypt-for-nginx)

Teste a renovação com:

```bash
sudo certbot renew --dry-run
```

Se esse comando terminar sem erro, a renovação automática está funcionando corretamente. [wehaveservers](https://wehaveservers.com/blog/linux-sysadmin/lets-encrypt-on-nginx-free-ssl-with-auto-renew-2025/)

Em instalações modernas, o Certbot normalmente usa um timer do `systemd` para executar a renovação automática. [wehaveservers](https://wehaveservers.com/blog/linux-sysadmin/lets-encrypt-on-nginx-free-ssl-with-auto-renew-2025/)

***

## 9. Validar se o serviço de renovação existe

Você pode verificar se há um timer ativo para renovação:

```bash
systemctl list-timers | grep certbot
```

Esse teste ajuda a confirmar que o sistema está pronto para tentar renovar os certificados automaticamente antes do vencimento. [wehaveservers](https://wehaveservers.com/blog/linux-sysadmin/lets-encrypt-on-nginx-free-ssl-with-auto-renew-2025/)

***

## 10. Erros comuns

### O Certbot não consegue validar o domínio

Isso geralmente acontece quando o domínio ainda não aponta para o IP da VPS ou quando a porta 80 está bloqueada no firewall. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

### O site funciona em HTTP, mas não em HTTPS

Normalmente isso indica que o certificado não foi emitido corretamente, o Nginx não foi recarregado como esperado ou a porta 443 não está liberada. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

### O navegador mostra aviso de certificado

Isso pode acontecer se você abriu o domínio errado, se o `www` não foi incluído no certificado ou se o DNS ainda não propagou corretamente. [help.time4vps](https://help.time4vps.com/en/articles/390216-ubuntu-let-s-encrypt-for-nginx)

***

## 11. Boa prática adicional

Depois de ativar HTTPS, vale manter o redirecionamento automático de HTTP para HTTPS e revisar periodicamente a configuração SSL do domínio. Algumas documentações também recomendam validar a configuração TLS em ferramentas externas, como SSL Labs, para verificar a qualidade final da configuração. [kamatera](https://www.kamatera.com/knowledgebase/how-to-secure-nginx-with-lets-encrypt/)

## Exemplo rápido de sequência

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo ufw allow 'Nginx Full'
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
sudo certbot renew --dry-run
```
