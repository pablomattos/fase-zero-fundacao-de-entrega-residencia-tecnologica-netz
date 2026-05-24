---

# Guia de Boas Práticas de Segurança: Node.js e Payload CMS em Produção (Fase 0 - Netz)

Este guia reúne as principais práticas de segurança que devem ser aplicadas na infraestrutura e no desenvolvimento do ecossistema Node.js, Payload CMS, VPS e Nginx para a Fase 0 da Netz.

---

## 1. Não rode como root e use um usuário dedicado

* **Regra:** Execute o Node.js com um usuário sem privilégios, nunca como `root`.
* **Como aplicar:** Crie um usuário específico para o deploy (ex: `node` ou `deploy`) e garanta que o processo só rode com os mínimos privilégios necessários.
* **Por que importa:** Isso limita significativamente o estrago físico e lógico no servidor caso alguém explore uma vulnerabilidade no seu código.

## 2. Use HTTPS em produção

* **Regra:** Sempre exija HTTPS (TLS), nunca trafegue dados em HTTP puro.
* **Como aplicar:** Se estiver usando Nginx, configure-o como proxy reverso para:
1. Receber o tráfego seguro TLS (Porta 443).
2. Redirecionar automaticamente todo tráfego `HTTP` (80) $\rightarrow$ `HTTPS` (443).
3. Encaminhar as requisições internamente para o Node.js na porta correspondente (ex: `http://localhost:3000`).
4. Utilizar **Let’s Encrypt + Certbot** com renovação automática ativada.


* **Por que importa:** Protege os dados em trânsito contra ataques de interceptação (*Man-in-the-Middle*).

## 3. Valide e sanitize toda entrada de usuário

* **Regra:** Trate qualquer dado externo (formulários, query strings, headers, body ou parâmetros de URL) como potencialmente malicioso.
* **Como aplicar:** * Utilize bibliotecas robustas de validação no ecossistema Node (ex: `zod`, `joi`, `express-validator`).
* No Express, limite o tamanho aceitável do corpo das requisições:
```ts
app.use(express.json({ limit: '100kb' }));

```


* No **Payload CMS**, use os validadores nativos nos campos (`validate`) e os hooks `beforeValidate` / `beforeChange` para aplicar regras de negócio rígidas.


* **Por que importa:** Evita ataques de injeção de código, SQL/NoSQL Injection e payloads exagerados que podem travar o servidor (DoS).

## 4. Nunca use `eval()` nem código dinâmico não tratado

* **Regra:** Evite funções que interpretem strings como código executável.
* **Como aplicar:** Nunca utilize `eval()`, `new Function()`, `setTimeout`/`setInterval` passando strings, ou o módulo nativo `vm` com dados vindos de inputs do usuário.
* **Por que importa:** O uso dessas estruturas abre brechas críticas para Execução Remota de Código (RCE). Se a execução dinâmica for estritamente necessária, isole-a em ambientes de sandbox fortemente protegidos.

## 5. Boas configurações de headers e middleware de segurança

* **Regra:** Proteja a aplicação mitigando vulnerabilidades comuns da web através de cabeçalhos HTTP adequados.
* **Como aplicar:** No Express/Next.js, utilize o middleware `helmet` para definir headers de segurança (como proteção contra XSS, Clickjacking, MIME-type sniffing, etc.):
```ts
import helmet from 'helmet';

// Integração básica no app Express
app.use(helmet());

```


Adicionalmente, desative cabeçalhos explícitos que revelem detalhes da stack (ex: `X-Powered-By`).
* **Por que importa:** Dificulta o mapeamento de vulnerabilidades por parte de atacantes automatizados.

## 6. Limitação de requisições e proteção contra DoS

* **Regra:** O Node.js roda em um modelo *single-thread* (Event Loop), o que significa que operações pesadas ou repetitivas podem facilmente travar a aplicação inteira.
* **Como aplicar:**
* Implemente limitação de taxa (*Rate Limiting*) usando pacotes como `express-rate-limit` especialmente em endpoints sensíveis (como `/api/users/login`, `/api/users/signup`).
* Controle rigorosamente o tamanho máximo de uploads no ecossistema do servidor.


* **Por que importa:** Reduz drasticamente a eficácia de ataques de negação de serviço (DoS) e tentativas de força bruta.

## 7. Gerenciamento seguro de dependências

* **Regra:** Monitore constantemente vulnerabilidades em pacotes de terceiros dentro do seu `node_modules`.
* **Como aplicar:** * Execute frequentemente comandos de auditoria no terminal: `pnpm audit` (ou `npm audit`).
* Integre ferramentas de análise contínua como o **Snyk** ou GitHub Dependabot diretamente ao pipeline de CI/CD.


* **Por que importa:** Impede que seu projeto herde falhas de segurança conhecidas presentes em bibliotecas de terceiros de código aberto.

## 8. Controle de credenciais e variáveis de ambiente

* **Regra:** Nunca armazene segredos diretamente no código-fonte (*hardcoding*).
* **Como aplicar:** * Armazene chaves de API, strings de conexão de banco de dados (`DATABASE_URL`), `PAYLOAD_SECRET` e tokens em arquivos `.env`.
* Adicione o arquivo `.env` ao `.gitignore` do repositório raiz.
* Carregue as variáveis em tempo de execução (`runtime`) utilizando `dotenv` ou as propriedades nativas do `process.env`.
* Mantenha arquivos `.env` distintos e isolados para cada ambiente (desenvolvimento, staging e produção).


* **Por que importa:** Evita o vazamento acidental de credenciais críticas em repositórios públicos ou privados.

## 9. Log seguro e monitoramento

* **Regra:** Registre eventos relevantes da aplicação sem expor dados confidenciais dos usuários.
* **Como aplicar:** * Utilize bibliotecas de log estruturado de alta performance (ex: `pino`, `winston`).
* **Nunca** inclua nos logs: senhas em texto plano, tokens de autenticação completos ou o conteúdo integral de `req.body`.
* Monitore anomalias como picos de erros `4xx`/`5xx` e falhas consecutivas de login.


* **Por que importa:** Garante a rastreabilidade do sistema em caso de incidentes sem ferir normas de privacidade de dados.

## 10. Política de acesso ao servidor (VPS)

* **Regra:** Tranque as portas da sua infraestrutura contra acessos externos não autorizados.
* **Como aplicar:**
* Utilize estritamente autenticação **SSH por chave pública**.
* Configure o firewall do sistema operacional (ex: `UFW` no Ubuntu) e as regras do provedor de nuvem para expor apenas o estritamente necessário (normalmente portas `22` para SSH, `80` para HTTP e `443` para HTTPS).
* Desative completamente a autenticação SSH por senha (`PasswordAuthentication no` no arquivo `/etc/ssh/sshd_config`).


* **Por que importa:** Elimina vetores de ataque baseados em força bruta direcionados à porta SSH da VPS.

## 11. Isolamento e revogação de privilégios

* **Regra:** Se o mesmo servidor hospedar mais de uma aplicação, adote o princípio do menor privilégio.
* **Como aplicar:** * Isole os processos criando usuários Linux distintos para cada aplicação.
* Separe as instâncias e acessos aos bancos de dados de forma que uma aplicação nunca consiga ler informações da outra.
* Revogue credenciais e acessos de desenvolvedores que deixarem o projeto ou mudarem de função.


* **Por que importa:** Mitiga o risco de movimentação lateral (onde o comprometimento de um app resulta na invasão de todo o servidor).

---

## 12. Configuração Mínima Segura para o seu Projeto Payload (Checklist Netz)

Para o cenário atual do projeto na **Fase 0**, certifique-se de cumprir e validar os seguintes pontos antes de considerar o ambiente pronto:

* [ ] **HTTPS Obrigatório:** Nginx configurado com Certbot, redirecionando todo o tráfego HTTP para HTTPS.
* [ ] **Acesso SSH por Chave:** VPS acessível apenas por chave pública, com o login tradicional por senha desativado no daemon do SSH.
* [ ] **Usuário não-root:** Processo do Node.js rodando sob a custódia de um usuário comum do sistema, sem privilégios administrativos.
* [ ] **Campos e Hooks do Payload:** Validadores ativos nas coleções e uso de hooks como `beforeValidate`/`beforeChange` para tratar regras críticas de escrita no banco.
* [ ] **Auditoria de Pacotes:** Varredura regular de vulnerabilidades rodando através do `pnpm audit`.
* [ ] **Segregação de Ambientes:** Arquivos `.env` estritamente separados entre ambiente local (dev) e servidor (produção), com senhas/secrets fortes e exclusivas geradas para a VPS.