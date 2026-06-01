Aqui está a explicação técnica detalhada para a tarefa de homologação e testes do painel administrativo. Este documento serve como um roteiro de testes (QA) para garantir que a fundação de dados do Payload CMS esteja sólida e utilizável antes de passar para o desenvolvimento dos sites de exemplo.

---

# Tarefa: Testar o painel /admin (Validação de Collections e Globals)

## 📌 Contexto e Objetivo

Após implementar o schema base no Payload CMS, a equipe precisa validar a experiência do usuário (UX) e a integridade do banco de dados PostgreSQL. O objetivo desta tarefa é realizar testes manuais de ponta a ponta para garantir que um usuário comum (ou a IA da Netz) consiga criar, ler, atualizar e deletar (**CRUD**) conteúdos sem estourar erros no console ou travar o servidor.

---

## 🛠️ Roteiro de Testes Passo a Passo

O fluxo de validação deve cobrir três estados principais de um conteúdo: **Rascunho (Draft), Publicado (Published) e Modificado.**

### 1. Validação da Collection de Mídia (`Media`)

* **Ação:** Acesse o painel `/admin`, vá até a coleção de Mídias e clique em "Create New".
* **O que testar:**
* Faça o upload de arquivos de diferentes extensões (PNG, JPG, SVG).
* Tente salvar **sem** preencher o campo de texto alternativo (`alt`). O sistema deve impedir o salvamento (validação de campo obrigatório para WCAG).
* Preencha o campo `alt` e salve. Certifique-se de que a imagem renderiza corretamente no painel.



### 2. Validação da Collection de Páginas (`Pages`)

* **Ação:** Vá até a coleção de Páginas e crie um novo documento (ex: Página "Home").
* **O que testar:**
* **Geração de Slug:** Insira o título "Página Inicial" e verifique se o campo `slug` se comporta conforme o esperado (ex: gerando automaticamente `pagina-inicial` ou validando caracteres especiais).
* **Campos de SEO:** Preencha os metadados e verifique se as restrições de caracteres funcionam (se houver).
* **Vínculo de Mídia:** Tente associar a imagem criada no passo anterior a algum campo de imagem da página.



### 3. Validação das Configurações Globais (`SiteSettings` & `SEO Global`)

* **Ação:** Acesse a aba de Globals no menu lateral.
* **O que testar:**
* Insira o nome do site, selecione o logotipo a partir da coleção de mídia e salve.
* Atualize os dados e clique em salvar novamente para garantir que o Payload está atualizando o mesmo registro no banco, em vez de criar um novo duplicado.



---

## 🔄 Fluxo de Ciclo de Vida do Conteúdo (O que verificar)

Ao testar a criação de documentos em `/admin`, certifique-se de validar o ciclo completo de publicação:

```
[ Criar Novo ] ──> [ Salvar Rascunho ] ──> [ Publicar (Status: Published) ] ──> [ Editar Conteúdo ] ──> [ Atualizar/Salvar ]

```

1. **Rascunho vs. Publicado:** Se o gerenciamento de versões (*Versions/Drafts*) estiver ativo no Payload, verifique se salvar como rascunho impede que o dado fique visível na API pública, e se o botão "Publish" altera esse estado corretamente.
2. **Persistência no Banco:** Abra o cliente PostgreSQL (via terminal ou ferramenta como DBeaver) e verifique se as tabelas foram povoadas corretamente com os textos e caminhos de arquivo testados.

---

## ⚠️ Checklist de Erros Comuns para Ficar de Olho (Troubleshooting)

Durante os testes, monitore o terminal da VPS ou os logs do contêiner/Node.js para capturar as seguintes falhas:

* **Erro de CORS / Upload de Arquivos:** Ao subir uma mídia, o painel trava ou dá erro `403/500`. Geralmente indica falta de permissão de escrita na pasta de destino no Linux (`public/media` ou similar) ou configuração incorreta do Nginx para arquivos grandes.
* **Quebra de Vínculo (Relacionamentos):** Tentar selecionar uma mídia dentro da página gera um erro de tela branca ou trava o banco. Isso ocorre se o ID da tabela de mídias não estiver batendo com o tipo esperado na tabela de páginas.
* **Problemas com Caracteres Especiais:** Salvar textos com acentuação (ex: "Institucional") corrompe o caractere no banco de dados ou gera slugs inválidos.

---

## ✅ Critérios de Aceite para Conclusão

A tarefa será considerada concluída (`Done`) quando a equipe validar e documentar que:

1. [ ] Foi possível criar pelo menos 1 registro completo de Configuração Global, 2 Mídias e 2 Páginas diferentes.
2. [ ] Nenhum erro de validação não tratado (tela branca ou travamento de banco) aconteceu durante o processo.
3. [ ] Todos os campos obrigatórios (especialmente `alt` de mídia e `slug` de página) estão rejeitando entradas vazias com mensagens claras para o usuário.
4. [ ] Os dados criados foram lidos e confirmados direto nas tabelas do banco de dados PostgreSQL da VPS.