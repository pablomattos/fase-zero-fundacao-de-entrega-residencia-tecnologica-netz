***
# Provisionar a VPS da Netz e configurar acesso SSH com chave pública

> Pré-requisitos: IP da VPS, usuário inicial (ex: `root` ou `ubuntu`) e senha/credencial inicial fornecidos pela Netz; Git Bash (Windows) ou terminal (macOS/Linux) para executar os comandos. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)

## 1 — Receber informações da Netz
- Peça à equipe ou painel de controle da Netz:
  - IP público da VPS (ex: `203.0.113.45`).  
  - Usuário inicial (ex: `root` ou `ubuntu`).  
  - Senha inicial (se houver) ou instruções de acesso no painel.  
  - Sistema operacional instalado (recomendado: Ubuntu 22.04 LTS).  
- Confirme se a porta 22 (SSH) está aberta no firewall do provedor. [digitalocean](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

***

## 2 — Gerar par de chaves SSH (no seu computador)

### Windows (Git Bash) / macOS / Linux
1. Abra Git Bash (Windows) ou terminal.
2. Gere a chave (RSA 4096 bits recomendado):
```bash
ssh-keygen -t rsa -b 4096 -C "seu-email@netz.com.br"
```
3. Aceite o caminho padrão (pressione Enter) e, se preferir, deixe a passphrase vazia (apenas Enter duas vezes).
4. Arquivos gerados:
   - `~/.ssh/id_rsa` → chave privada (NUNCA compartilhar).  
   - `~/.ssh/id_rsa.pub` → chave pública (esta você enviará para a VPS).  
5. Copie a chave pública para o clipboard:
- Linux/macOS:
```bash
cat ~/.ssh/id_rsa.pub
```
- Windows (Git Bash):
```bash
cat ~/.ssh/id_rsa.pub
```
Copie toda a linha exibida (começa com `ssh-rsa` ou `ssh-ed25519`). [learn.microsoft](https://learn.microsoft.com/pt-br/azure/virtual-machines/linux/create-ssh-keys-detailed)

***

## 3 — Login inicial na VPS (com senha)

1. No seu terminal:
```bash
ssh usuario_inicial@IP_DA_VPS
```
Exemplo:
```bash
ssh root@203.0.113.45
```
2. Informe a senha inicial, se solicitada.  
3. Após o primeiro acesso, é recomendável criar um usuário não-root para deploy e administração:  
```bash
sudo adduser seu_user
sudo usermod -aG sudo seu_user
```
4. Troque para o novo usuário (ou abra nova sessão):
```bash
su - seu_user
# ou no cliente:
ssh seu_user@203.0.113.45
```
(Usar um usuário sudo em vez de root aumenta segurança e facilita auditoria.) [digitalocean](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

***

## 4 — Instalar chave pública do seu computador na VPS

Há duas formas comuns: manual (colar a chave) ou via comando de envio (pipe). Escolha a que for mais prática.

### 4A — Método manual (recomendado para iniciantes)
No servidor (como `seu_user`):

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Abra o arquivo para edição:
```bash
nano ~/.ssh/authorized_keys
```
Cole a linha da sua chave pública (do `cat ~/.ssh/id_rsa.pub` no seu computador), salve e feche (`Ctrl+O`, `Enter`, `Ctrl+X`).

Verifique dono e permissões:
```bash
chown -R seu_user:seu_user ~/.ssh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```


### 4B — Método rápido via pipe (do seu computador)
No seu computador (substitua usuário e IP):

```bash
cat ~/.ssh/id_rsa.pub | ssh usuario_inicial@IP_DA_VPS "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

- Se você ainda usa a senha inicial, o comando pedirá a senha para autenticar a operação. [docs.digitalocean](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-existing-droplet/)

***

## 5 — Testar login por chave (no seu computador)

Tente conectar sem senha:
```bash
ssh seu_user@IP_DA_VPS
```
- Se conectar e não pedir senha, sucesso.  
- Se pedir senha ou der erro "Permission denied (publickey)", verifique:  
  - Se a chave pública foi copiada corretamente (sem quebras de linha).  
  - Dono e permissões de `~/.ssh` e `authorized_keys`.  
  - Se você conectou com o usuário correto (o arquivo `~/.ssh/authorized_keys` pertence ao usuário com o qual você está tentando logar). [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)

Permissões necessárias (no servidor):
```bash
ls -ld ~/.ssh         # deve ser 700
ls -l ~/.ssh/authorized_keys  # deve ser 600
```
Se precisar corrigir:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R seu_user:seu_user ~/.ssh
```

***

## 6 — Desativar autenticação por senha (opcional e recomendado)

Apenas após confirmar que login por chave funciona sem problemas:

1. Edite o arquivo de configuração do SSH:
```bash
sudo nano /etc/ssh/sshd_config
```
2. Defina ou altere as linhas:
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
```
3. Salve e reinicie o serviço:
```bash
sudo systemctl restart ssh
```
Atenção: se você perder acesso por chave, será necessário acessar o console do provedor para restaurar acesso. Não faça esse passo até garantir o login por chave. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)

***

## 7 — Boas práticas e recomendações adicionais
- Gere chaves com 4096 bits (RSA) ou prefira Ed25519 (`ssh-keygen -t ed25519`) para chaves menores e seguras. [learn.microsoft](https://learn.microsoft.com/pt-br/azure/virtual-machines/linux/create-ssh-keys-detailed)
- Proteja sua chave privada: não a compartilhe e não a comite no Git.  
- Use passphrase se quiser mais segurança (pode exigir agent para não digitar sempre).  
- Configure `~/.ssh/config` no seu laptop para atalhos de conexão (Host, HostName, User, IdentityFile).  
- Registre tudo no `deploy.md`: IP, usuário, comandos utilizados, nome do usuário criado, localização da chave pública e observações sobre permissões. [docs.digitalocean](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-existing-droplet/)

***

## 8 — Exemplo mínimo para `deploy.md` (copiar/colar)

```markdown
# Deploy - Acesso SSH

VPS:
- IP: 203.0.113.45
- SO: Ubuntu 22.04
- Usuário inicial: root
- Usuário de deploy criado: deploy

Geração de chave (local):
- ssh-keygen -t rsa -b 4096 -C "seu-email@netz.com.br"
- Chave pública: ~/.ssh/id_rsa.pub

Instalação da chave na VPS (exemplo manual):
- mkdir -p ~/.ssh
- chmod 700 ~/.ssh
- nano ~/.ssh/authorized_keys (colar chave pública)
- chmod 600 ~/.ssh/authorized_keys
- chown -R deploy:deploy ~/.ssh

Teste:
- ssh deploy@203.0.113.45

Segurança (opcional):
- Editar /etc/ssh/sshd_config:
  PasswordAuthentication no
  PermitRootLogin no
  PubkeyAuthentication yes
- sudo systemctl restart ssh
```

***
