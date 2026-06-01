# fase-zero-fundacao-de-entrega-residencia-tecnologica-netz

# Resumo da Fase 0 — Residência Tecnológica Netz

- A Fase 0 do projeto Portal de Parcerias Netz tem como objetivo criar a base técnica e documental que sustentará o desenvolvimento dos próximos sites da empresa.
- O portal está sendo pensado como uma plataforma B2B para que agências de marketing parceiras enviem briefings de projetos e recebam orçamentos gerados automaticamente por inteligência artificial.
- Nesse fluxo, a agência se cadastra, envia a demanda do cliente, recebe o orçamento, define seu preço de venda e fecha o projeto com o cliente final.
- Depois disso, a Netz executa o projeto com apoio de IA e multiagentes, entregando também um CMS para que o cliente possa editar conteúdos do site com autonomia.
- A equipe da Residência Tecnológica é responsável por estruturar o formulário de briefing que será usado pelas agências parceiras.
- Também cabe à equipe produzir um pacote de documentação técnica em Markdown, que servirá de referência para os desenvolvedores que atuarão nas próximas etapas.
- Outro eixo importante da fase é instalar e configurar o Payload CMS em uma VPS real da Netz.
- Além disso, a equipe deverá criar sites de exemplo para validar o funcionamento do processo de ponta a ponta.
- A fase tem duração estimada de 8 a 10 semanas e está dividida entre briefing e formulário, documentação Markdown, implantação do Payload CMS e testes com sites de exemplo.
- Para apoiar a execução, o projeto reúne materiais de estudo sobre Git, UX de formulários, Markdown, design systems, acessibilidade, SEO, infraestrutura com Linux, Node.js, Nginx, HTTPS e PostgreSQL.

  # Plano de Atividades por Semana — Projeto Netz

## Visão Geral

Este documento organiza as tarefas técnicas do projeto Portal de Parcerias Netz por semana, com foco na preparação da infraestrutura, configuração do Payload CMS e validação do processo de deploy.

## Semana 04/05–10/05
- [x] Estudar conceitos de VPS: o que é, como funciona e diferença de hospedagem compartilhada **(2026-05-07)**
- [x] Estudar Payload CMS: ler documentação oficial, collections, globals, hooks e admin UI **(2026-05-08)**

## Semana 11/05–17/05
- [x] Estudar Linux e linha de comando: navegação, permissões, SSH e gestão de processos **(2026-05-11)**
- [x] Estudar PostgreSQL básico: criação de banco, permissões e conexão via Node.js **(2026-05-12)**
- [ ] Provisionar a VPS da Netz e configurar acesso SSH com chave pública **(2026-05-14)**
- [x] Pesquisar boas práticas de segurança em servidores Node.js em produção **(2026-05-16)**
- [ ] Instalar e configurar Node.js, npm e PostgreSQL no servidor **(2026-05-17)**

## Semana 18/05–24/05
- [ ] Configurar Nginx como reverse proxy para a aplicação Node.js **(2026-05-18)**
- [ ] Estudar configuração de HTTPS com Let's Encrypt e Certbot **(2026-05-20)**
- [x] Criar projeto Payload CMS com configuração inicial e estrutura de pastas **(2026-05-21)**  
  - *Foco em collections, globals, SEO e configurações de site.*
- [x] Conectar Payload ao banco PostgreSQL e validar a conexão **(2026-05-23)**

## Semana 25/05–31/05
- [ ] Configurar certificado SSL e ativar HTTPS na aplicação **(2026-05-25)**
- [ ] Implementar schema base: páginas, mídia, SEO global e configurações do site **(2026-05-26)**
- [ ] Testar o painel `/admin`: criar, editar e publicar conteúdo de todas as collections **(2026-05-30)**
- [ ] Atualizar o `deploy.md` com o processo real executado na VPS, incluindo problemas encontrados **(2026-05-31)**

## Semana 01/06–07/06
- [ ] Simular reset completo: seguir o `deploy.md` em ambiente limpo e validar se o processo é reproduzível sem assistência **(2026-06-02)**
