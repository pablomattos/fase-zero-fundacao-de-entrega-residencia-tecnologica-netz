# Documentação de Conceitos de VPS

## Visão Geral

Uma **VPS (Virtual Private Server)** é um servidor virtual privado criado dentro de um servidor físico maior por meio de virtualização. Na prática, isso significa que uma única máquina real é dividida em vários ambientes isolados, e cada ambiente se comporta como se fosse um servidor próprio. 

Esse modelo existe para oferecer **mais controle, previsibilidade e liberdade de configuração** do que a hospedagem compartilhada, sem chegar ao custo de um servidor dedicado inteiro. Para aplicações como um CMS com Node.js, banco de dados e proxy reverso, esse tipo de ambiente é especialmente útil porque permite instalar e administrar o stack necessário. 

## Servidor Físico

O ponto de partida é o **servidor físico**, que é a máquina real localizada em um data center. Esse computador possui processador, memória RAM, armazenamento e conexão de rede, da mesma forma que um computador comum, mas projetado para operar continuamente e atender aplicações na internet. 

Em vez de entregar a máquina inteira para um único cliente, o provedor pode dividir seus recursos em várias partes menores e oferecer cada uma delas como um servidor virtual independente. É justamente dessa **divisão controlada** que surge a VPS. 

## Virtualização

A tecnologia que permite essa divisão se chama **virtualização**. Ela usa uma camada de software para separar o hardware físico em várias **máquinas virtuais**, cada uma com recursos próprios e isolamento em relação às demais. 

De forma simples, a virtualização faz com que vários "computadores" existam dentro do mesmo equipamento real. Embora todos compartilhem o mesmo hardware de base, cada VPS recebe uma **parcela definida de CPU, RAM, disco e rede**, e o usuário interage com ela como se fosse uma máquina exclusiva. 

## Como uma VPS Funciona

Quando um provedor cria uma VPS, ele **reserva para ela uma quantidade específica de recursos** (memória, armazenamento e capacidade de processamento). Depois disso, instala-se um sistema operacional nesse ambiente, normalmente Linux, e o cliente passa a acessá-lo remotamente. 

Esse acesso costuma ser feito por **SSH**, que é um protocolo usado para abrir um terminal remoto de forma segura. A partir daí, torna-se possível instalar programas, criar usuários, configurar serviços, abrir aplicações em portas específicas e administrar o servidor quase como se ele estivesse fisicamente ao lado do desenvolvedor. 

## Significado dos Termos Mais Importantes

### Root
**Root** é o usuário administrador do sistema. Ter acesso root significa poder instalar pacotes, editar arquivos sensíveis, iniciar e parar serviços e alterar configurações globais do servidor. 

### Sistema Operacional
O **sistema operacional** é o software principal da máquina, como Ubuntu ou Debian. Em uma VPS, cada instância pode executar seu próprio sistema operacional, o que aumenta o isolamento e a liberdade de configuração. 

### CPU e vCPU
**CPU** é a unidade de processamento do servidor físico. Quando o plano fala em **vCPU**, está se referindo a uma parcela virtualizada de processamento disponibilizada para a VPS. 

### RAM
**RAM** é a memória usada pelos programas enquanto estão em execução. Quanto mais memória disponível, maior a capacidade de manter aplicações e processos funcionando com estabilidade. 

### Disco
O **disco** é o espaço onde ficam sistema, arquivos, banco de dados, logs e uploads. Em planos de VPS, esse armazenamento costuma ser informado em gigabytes e pode usar tecnologias como **SSD** ou **NVMe** para melhorar desempenho. 

### IP
O **IP** é o endereço de rede pelo qual a VPS pode ser acessada na internet. É com ele que o usuário normalmente se conecta por SSH antes mesmo de configurar um domínio. 

### Porta
**Porta** é um canal lógico de comunicação dentro do servidor. Por exemplo, aplicações web podem escutar em uma porta interna, enquanto o Nginx recebe o tráfego público e encaminha as requisições para essa aplicação. 

## Diferença entre VPS e Hospedagem Compartilhada

Na hospedagem compartilhada, vários sites usam o mesmo ambiente e o mesmo conjunto geral de recursos, com pouca liberdade de configuração e forte dependência das regras do provedor. Isso costuma funcionar bem para sites simples, mas limita bastante projetos que exigem tecnologias específicas no servidor. 

Na VPS, o ambiente é **isolado** e o cliente possui **acesso administrativo** ao sistema, o que permite instalar Node.js, PostgreSQL, Nginx, certificados SSL e outros componentes necessários para uma aplicação moderna. Além disso, o comportamento do servidor tende a ser **mais previsível**, porque os recursos estão melhor controlados do que em uma hospedagem totalmente compartilhada. 

### Comparação Prática

| Critério                | Hospedagem Compartilhada                          | VPS                                                                 |
|-------------------------|---------------------------------------------------|---------------------------------------------------------------------|
| **Isolamento**          | Baixo, vários sites dividem o mesmo ambiente      | Alto, cada cliente opera em ambiente virtual próprio                |
| **Controle**            | Limitado, normalmente via painel do provedor      | Elevado, com acesso administrativo e configuração do sistema        |
| **Instalação de softwares** | Restrita ou inexistente                        | Permitida conforme a necessidade do projeto                         |
| **Desempenho**          | Mais sensível à atividade de outros clientes      | Mais previsível por causa da alocação definida de recursos          |
| **Caso de uso típico**  | Site institucional simples, blog pequeno, WordPress básico | Aplicações customizadas, APIs, CMS headless e ambientes de teste ou produção |

## Por que VPS faz Sentido para o Projeto da Netz

O projeto da Netz envolve **Payload CMS, Node.js, PostgreSQL, Nginx e HTTPS**, que são componentes normalmente configurados no sistema operacional do servidor. Esse cenário exige liberdade para instalar dependências, editar configurações do ambiente e manter processos de aplicação em execução, algo muito mais compatível com VPS do que com hospedagem compartilhada. 

Também há um ganho importante de **previsibilidade operacional**, porque o time consegue documentar o processo de provisionamento, replicar deploys e controlar diretamente o ambiente em que o CMS roda. Isso é relevante em uma fase de fundação de entrega, na qual a reprodutibilidade do processo é tão importante quanto a aplicação em si. 

## Exemplo Simples de Arquitetura

Em um cenário típico, o usuário acessa o domínio da aplicação pelo navegador. O tráfego chega primeiro ao **Nginx** (servidor web e reverse proxy), que encaminha para a aplicação **Node.js** onde o Payload CMS está rodando; essa aplicação conversa com o **PostgreSQL** para ler e gravar dados. 
