```markdown
# Configuração de Certificado SSL e Ativação de HTTPS

Este guia consolida os passos necessários para configurar o certificado SSL e ativar o HTTPS na aplicação utilizando o Certbot e o Nginx na VPS.

---

## Passo 1: Confirmar o funcionamento em HTTP
Antes de iniciar a configuração de segurança, certifique-se de que o site está acessível externamente respondendo na porta 80. Acesse o domínio no navegador para garantir que o Nginx está pronto:
```text
[http://seudominio.com](http://seudominio.com)

```

## Passo 2: Atualizar os pacotes do sistema

Acesse o servidor via SSH e atualize a lista de pacotes local para garantir que o Certbot seja obtido corretamente:

```bash
sudo apt update

```

## Passo 3: Instalar o Certbot com o plugin do Nginx

Instale a ferramenta Certbot juntamente com o plugin específico que permite detetar e injetar as configurações automaticamente nos blocos do servidor Nginx:

```bash
sudo apt install certbot python3-certbot-nginx -y

```

## Passo 4: Ajustar o firewall do servidor (UFW)

Modifique as regras do firewall para alterar o perfil do Nginx para `Nginx Full`, permitindo o tráfego criptografado (porta 443) e mantendo a porta 80 aberta para validações e redirecionamentos:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status

```

## Passo 5: Emitir o certificado SSL e automatizar o Nginx

Execute o assistente interativo do Certbot mapeando o domínio principal e a variação `www`. Durante este processo, a ferramenta validará o domínio e alterará os blocos do Nginx. **Quando o assistente perguntar, selecione a opção para redirecionar todo o tráfego HTTP para HTTPS:**

```bash
sudo certbot --nginx -d seudominio.com -d [www.seudominio.com](https://www.seudominio.com)

```

## Passo 6: Testar o HTTPS no navegador e terminal

Valide se a aplicação está segura acedendo a `https://seudominio.com` para checar o ícone de cadeado ou execute o comando de verificação de cabeçalho diretamente no terminal:

```bash
curl -I [https://seudominio.com](https://seudominio.com)

```

## Passo 7: Verificar as alterações no Nginx

Confirme que o Certbot alterou automaticamente o bloco do Nginx para incluir o certificado, a chave privada e o redirecionamento na porta 80. As linhas inseridas devem apontar para:

```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/[seudominio.com/fullchain.pem](https://seudominio.com/fullchain.pem);
ssl_certificate_key /etc/letsencrypt/live/[seudominio.com/privkey.pem](https://seudominio.com/privkey.pem);

```

## Passo 8: Testar e validar a renovação automática

Como os certificados expiram em 90 dias, simule o processo de renovação em segundo plano (*dry run*) para garantir que o mecanismo funcionará corretamente:

```bash
sudo certbot renew --dry-run

```

Por fim, confirme que o timer do `systemd` responsável pelo agendamento da renovação automática está ativo no sistema:

```bash
systemctl list-timers | grep certbot

```

```

```