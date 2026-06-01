
---

# Tarefa: Atualizar o `deploy.md` com o Processo Real da VPS

## 📌 Contexto e Objetivo

O arquivo `deploy.md` criado no início do projeto era um guia teórico. Agora que a equipe passou pela experiência real de configurar o servidor, instalar dependências, apontar o DNS e ativar o SSL, esse documento precisa ser atualizado com a **verdade de campo**.

O objetivo é registrar o passo a passo exato que funcionou na VPS da Netz e, mais importante, documentar o *troubleshooting* (erros encontrados e como foram resolvidos). Isso garantirá a autonomia dos futuros times de desenvolvimento e dos multiagentes de IA.

---

## 🏗️ Estrutura Recomendada para o Novo `deploy.md`

O documento atualizado deve ser dividido em três grandes blocos:

### 1. O Fluxo de Instalação Limpo (O que funciona)

Escreva a sequência linear de comandos que uma pessoa deveria rodar se comprasse uma VPS idêntica hoje.

* **Infraestrutura:** Versão exata do Ubuntu, Node.js e PostgreSQL utilizados.
* **Servidor Web:** Blocos de configuração reais do Nginx (ocultando IPs e domínios sensíveis).
* **Process Manager:** Como o PM2 ou o Systemd foi configurado para manter o Payload CMS rodando em segundo plano.

### 2. Diário de Bordo: Problemas Encontrados e Soluções

Esta é a seção mais valiosa da fundação documental. Toda vez que o time tomou um "bloqueio" durante a semana, a solução deve ser registrada aqui.

**Exemplo de formatação para a seção de erros:**

> ### ❌ Erro: Falha de Permissão no Upload de Mídias (HTTP 500)
> 
> 
> * **O que aconteceu:** Ao tentar testar o painel `/admin` e subir uma imagem, o Payload retornava erro interno e a imagem não era salva.
> * **Causa raiz:** O processo do Node.js (executado pelo PM2 sob o usuário `ubuntu`) não tinha permissão de escrita na pasta `public/uploads` criada pelo usuário `root`.
> * **Como foi resolvido:** Alteramos o proprietário da pasta para o usuário correto com o comando:
> ```bash
> sudo chown -R ubuntu:ubuntu /var/www/portal-netz/public/uploads
> 
> ```
> 
> 
> 
> 

### 3. Variáveis de Ambiente (`.env.example`)

Deixe mapeadas todas as chaves que o sistema precisa para rodar em produção, com valores fictícios ou explicações de onde obter cada token.

* `DATABASE_URI` (String de conexão do PostgreSQL local).
* `PAYLOAD_SECRET` (Chave de criptografia dos cookies do admin).
* `PORT` (Porta interna onde o Node.js escuta, ex: `3000`).

---

## 📝 Como Coletar as Informações no Servidor

Se o time esqueceu de anotar os comandos ou os caminhos dos erros durante a execução, usem os seguintes comandos no terminal da VPS para resgatar o histórico:

1. **Histórico de Comandos:** Puxe tudo o que foi digitado no terminal para lembrar a ordem exata das instalações:
```bash
history | grep -E "apt|nginx|certbot|pm2"

```


2. **Logs de Erro do Nginx:** Verifique se o servidor web barrou alguma requisição importante:
```bash
sudo tail -n 50 /var/var/log/nginx/error.log

```


3. **Logs do Payload CMS:** Caso tenham usado o PM2, revisem o histórico de travamentos da aplicação:
```bash
pm2 logs --lines 100

```



---

## ⚠️ Critérios de Aceite para Conclusão

A tarefa estará concluída (`Done`) quando o arquivo `deploy.md` no repositório contiver:

1. [ ] O IP ou domínio real do servidor substituído por placeholders genéricos (ex: `seu-dominio.com` ou `12.34.56.78`) por questões de segurança.
2. [ ] Pelo menos os 3 principais problemas enfrentados pela equipe descritos com **Causa** e **Resolução**.
3. [ ] Instruções claras sobre como reiniciar a aplicação na VPS caso o servidor seja reiniciado (configuração do PM2 Startup ou Systemd).
4. [ ] Revisão de texto aprovada por um segundo membro da equipe para garantir que as instruções estão compreensíveis.