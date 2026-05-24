# Fundamentos de Linux e Terminal

## 1. O que é Linux

Linux é um sistema operacional similar ao Windows, porém amplamente utilizado em servidores, desenvolvimento de software, automação de tarefas e dispositivos embarcados.  
É muito valorizado por oferecer controle detalhado do sistema, alta estabilidade e um terminal poderoso para automatizar e acelerar tarefas (scripts, redes, automação, etc.).

Na prática, o Linux permite:
- Desenvolver e testar software.
- Administrar máquinas remotamente.
- Estudar redes, segurança e servidores.
- Rodar scripts e organizar projetos técnicos com eficiência.


## 2. Por que aprender linha de comando

A **linha de comando** é uma forma de interagir com o sistema operacional digitando comandos em vez de clicar em menus gráficos.  
No início, parece mais difícil, mas é muito mais rápido e flexível para:

- Navegar pelo sistema de arquivos.
- Copiar, mover e deletar arquivos.
- Alterar permissões e proprietários.
- Acessar máquinas remotas.
- Diagnosticar e resolver problemas rapidamente.

Um único comando no terminal pode substituir dezenas de cliques em um ambiente gráfico, o que torna o **aprendizado do terminal um dos passos mais importantes ao estudar Linux**.


## 3. Navegação no terminal

Navegar no Linux significa se mover pelas pastas (diretórios) do sistema.  
Os comandos mais básicos são:

- `pwd` – mostra o **diretório atual** (present working directory).
- `ls` – lista os **arquivos e pastas** do diretório atual.
- `cd` – entra em **outra pasta** (change directory).

### Exemplo prático

```bash
pwd            # mostra onde você está no sistema
ls             # lista os arquivos da pasta atual
cd Documentos  # entra na pasta "Documentos"
```

Esse ciclo básico (`pwd` → `ls` → `cd`) é o coração da navegação no terminal.


## 4. Arquivos e pastas

No Linux, tudo é organizado em **arquivos** e **diretórios** (pastas).  
Alguns comandos essenciais são:

- `mkdir` – cria uma nova pasta.
- `touch` – cria um arquivo vazio ou atualiza seu timestamp.
- `cp` – copia arquivos ou pastas.
- `mv` – move ou renomeia arquivos/pastas.
- `rm` – apaga arquivos ou pastas (com cuidado).

### Exemplo de uso

```bash
mkdir estudos              # cria a pasta "estudos"
cd estudos
touch anotacoes.txt        # cria um arquivo
cp anotacoes.txt backup.txt  # copia o arquivo
mv backup.txt backups/     # move o arquivo
```

Isso ajuda a **organizar projetos**, criar estruturas de pastas, copiar arquivos antes de editar e manter scripts em locais pré‑definidos.


## 5. Permissões

**Permissões** definem quem pode **ler**, **escrever** ou **executar** um arquivo ou diretório.  
São essenciais para a segurança e organização do sistema.

### Três grupos

- **Proprietário** – usuário dono do arquivo.
- **Grupo** – conjunto de usuários que compartilha permissões.
- **Outros usuários** – demais usuários do sistema.

### Três tipos de permissão

- **Leitura** (`r`) – ver o conteúdo.
- **Escrita** (`w`) – alterar ou apagar.
- **Execução** (`x`) – rodar como programa (scripts, binários).

### Exemplo prático

- Um script precisa de permissão de execução (`chmod +x script.sh`) para rodar.
- Um arquivo de configuração pode ser protegido para evitar alterações indevidas por outros usuários.


## 6. Usuários e grupos

No Linux, cada pessoa que usa o sistema tem uma **conta de usuário**.  
**Grupos** reúnem usuários com permissões similares, facilitando a gestão de acesso.

### Por que isso importa

- Nem todo mundo deve ter acesso a tudo.
- Em ambientes reais:
  - **Administradores** podem alterar configurações de sistema.
  - **Usuários comuns** só leem arquivos ou executam programas permitidos.

Isso permite:
- **Acesso granular** a recursos.
- **Segurança** ao limitar o que cada usuário pode fazer.


## 7. SSH

**SSH** (Secure Shell) é um protocolo para **acessar outro computador pela rede de forma segura**, usando o terminal.  
É amplamente usado para:

- Administrar servidores.
- Gerenciar Raspberry Pi e máquinas remotas.
- Executar comandos sem estar fisicamente no local.

### Exemplo real

```bash
ssh usuario@ip_do_servidor
```

Assim, você entra no servidor remoto, altera arquivos, reinicia serviços e ajusta configurações, tudo sem monitor ou teclado físico conectados.


## 8. Processos

Um **processo** é um programa em execução no sistema.  
Alguns processos são visíveis (interface gráfica), outros rodam em segundo plano.

### Comandos úteis

- `ps` – mostra os **processos atuais**.
- `top` / `htop` – mostra processos **em tempo real**, com uso de CPU e memória.
- `kill` – encerra um processo específico.

### Quando usar

- Um programa **trava** ou não responde.
- Algo **consome muita memória** ou CPU.
- Você precisa **reiniciar ou matar** um serviço manualmente.


## 9. Serviços

**Serviços** são programas que rodam continuamente em segundo plano para prover alguma função ao sistema.  
Exemplos:

- Servidor SSH (`sshd`).
- Servidor web (`apache`, `nginx`).
- Banco de dados (`mysql`, `postgresql`).

### Tarefas comuns

- Verificar se um serviço está ativo: `systemctl status nome_servico`.
- Reiniciar após alterar configuração: `systemctl restart nome_servico`.
- Garantir que sobe na inicialização: `systemctl enable nome_servico`.


## 10. Logs

**Logs** são arquivos de registro que guardam o que acontece no sistema.  
Eles armazenam:

- Erros.
- Avisos.
- Inicializações de serviços.
- Eventos de rede e segurança.

### Por que são essenciais

- Quando um serviço **não sobe** ou **falha**.
- Quando uma conexão ou aplicação **para subitamente**.
- Para **diagnosticar** e corrigir problemas rapidamente.

Exemplos de locais comuns:
- `/var/log/` – onde ficam muitos logs do sistema.
- Logs específicos de serviços: `/var/log/nginx/`, `/var/log/mysql/`, etc.


## 11. Fluxo de estudo recomendado

Uma ordem lógica para aprender Linux é:

1. **Navegação** – se localizar nas pastas.
2. **Arquivos e pastas** – criar, copiar, mover, apagar.
3. **Permissões** – entender quem pode fazer o quê.
4. **Usuários e grupos** – organizar acesso e responsabilidades.
5. **SSH** – acessar máquinas remotas.
6. **Processos** – gerenciar programas em execução.
7. **Serviços** – gerenciar programas que ficam sempre rodando.
8. **Logs** – entender e diagnosticar problemas.

Essa sequência é eficiente porque você:
- Aprende primeiro a **se mover** no sistema.
- Depois, a **manipular arquivos**.
- Em seguida, a **controlar acesso**.
- Por fim, a **administrar** o sistema como um todo.


## 12. Como praticar de verdade

O melhor jeito de aprender Linux é **praticar comandos logo após cada tópico**.  
Ler não é suficiente: é preciso digitar, errar, corrigir e repetir.

### Exemplo de rotina prática

```bash
cd /tmp
mkdir laboratorio
cd laboratorio
touch arquivo.txt
mkdir backups
cp arquivo.txt backups/
chmod 600 arquivo.txt
ls -l
ps aux | head -5
journalctl -n 10
ssh usuario@ip_do_servidor
```

Repetir esse tipo de sequência transforma o conhecimento teórico em **habilidade prática**.


## 13. Resumo da ideia central

Linux pode ser visto como um **ambiente de trabalho organizado por pastas, permissões, usuários, processos e serviços**.  
A **linha de comando** é a ferramenta que conecta todos esses conceitos de forma rápida e eficiente.

Ao dominar esses fundamentos, você terá uma **base sólida** para seguir em:

- Administração de sistemas.
- Redes e segurança.
- Programação e automação de tarefas.
