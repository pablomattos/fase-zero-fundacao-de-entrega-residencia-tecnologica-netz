Aqui está a explicação técnica e estruturada em Markdown para a tarefa de simulação e validação do deploy, que fecha com chave de ouro a rodada de testes de infraestrutura da Fase 0.

---

# Tarefa: Simular Reset Completo e Validar Reprodutibilidade do `deploy.md`

## 📌 Contexto e Objetivo

Uma documentação de deploy só é considerada válida se um desenvolvedor que nunca viu o projeto conseguir segui-la do início ao fim e colocar o sistema no ar sem precisar pedir ajuda.

O objetivo desta tarefa é realizar um teste de "caixa preta" (*blind test*) da infraestrutura. A equipe vai simular um ambiente completamente limpo, executar os passos exatos registrados no `deploy.md` e validar se o processo de instalação do Payload CMS, PostgreSQL, Nginx e SSL está 100% blindado contra falhas ou omissões.

---

## 🛠️ Como Executar a Simulação (Roteiro de Validação)

Para não derrubar o ambiente que já está funcionando em produção, a equipe deve seguir uma destas duas abordagens para o teste em ambiente limpo:

### Opção A: Usar uma Segunda Instância/Porta (Recomendado)

Se houver orçamento/recursos, suba uma VPS temporária idêntica à original. Caso contrário, faça o processo na mesma VPS, mas simulando um diretório e portas isoladas (ex: rodando o Node na porta `3001` e configurando um arquivo de bloco de teste no Nginx como `homolog.seudominio.com`).

### Opção B: O "Designado de Testes"

Escolha um membro da equipe que **não** ficou responsável pela configuração da VPS na semana passada. Essa pessoa pegará o `deploy.md` e tentará rodar o processo. Os membros que configuraram a VPS original devem apenas observar e anotar as dificuldades, sem intervir ou dar "dicas" fora do documento.

---

## 📋 Lista de Verificação Durante o Reset

O testador deve avaliar os seguintes pontos críticos enquanto executa o manual:

1. **Dependências Omitidas:** O documento diz para rodar o projeto, mas esqueceu de mencionar que era necessário instalar o `yarn`/`pnpm` globalmente? Ou faltou a instalação do `certbot`?
2. **Caminhos de Pastas:** Os comandos de terminal usam caminhos absolutos corretos (ex: `/var/www/...`) ou assumem que o usuário já está na pasta correta?
3. **Configurações Ocultas:** Existe algum arquivo de configuração ou permissão de pasta (`chmod`/`chown`) que foi modificado manualmente no primeiro deploy e ficou de fora do arquivo `.md`?
4. **Variáveis de Ambiente:** O arquivo `.env.example` fornecido é suficiente para fazer o sistema conectar ao banco de dados local do zero?

---

## 🔄 Fluxo do Teste de Estresse

```
[ Ambiente Limpo ] ──> [ Executar comandos do deploy.md ] ──> [ Falhou? ] ──> Sim ──> [ Corrigir deploy.md ] ──> Reiniciar Teste
                                 │
                                Não
                                 ▼
                     [ Sistema Rodando em HTTPS ]

```

Se o executor do teste travar em algum passo por falta de informação ou comando errado:

1. O teste é interrompido.
2. O `deploy.md` é corrigido imediatamente com a informação que faltava.
3. O passo é reexecutado para garantir que a correção funciona.

---

## ⚠️ Critérios de Aceite para Conclusão

A tarefa será movida para *Done* quando:

1. [ ] O processo de deploy foi executado do início ao fim por um membro da equipe sem assistência verbal dos criadores do documento.
2. [ ] O Payload CMS subiu com sucesso e o painel `/admin` ficou acessível no ambiente de teste.
3. [ ] Nenhuma dependência oculta ou comando "de cabeça" foi necessário para concluir a instalação.
4. [ ] O arquivo `deploy.md` foi homologado e assinado pela equipe como "Pronto para Replicação".