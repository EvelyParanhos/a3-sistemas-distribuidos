# EbookStore — Sistema Distribuído (A3 Sistemas Distribuídos)

Sistema distribuído de uma loja de **ebooks digitais**, composto por duas APIs REST
(**API Principal** e **Serviço de Relatórios**), um **gateway nginx**, banco **MySQL**
e **Keycloak** como provedor de identidade (autenticação/autorização OAuth2/OIDC).

Os produtos são livros digitais que podem estar **em catálogo** ou não — não há controle
de estoque. Ao confirmar uma venda, são geradas **cópias únicas** (chaves/números de série)
para o cliente, e essas chaves são **entregues por e-mail** (envio simulado).

---

## a. Equipe

| Nome completo                  | Matrícula     |
| ------------------------------ | ------------- |
| Caio Ricardo B. C. Santos      | 12724217796   |
| Evely Paranhos Souza           | 12724221514   |
| Rosana de Sousa Carvalho       | 12724222260   |

---

## b. Requisitos de software

A forma recomendada de executar é via **Docker** — nesse caso só o Docker é pré-requisito.
Para rodar/testar localmente fora de contêiner, é necessário Node.js.

**Pré-requisitos (execução com Docker):**

- Docker Engine + Docker Compose v2

**Pré-requisitos (execução/testes locais):**

- Node.js **20.x** (LTS) e npm

**Linguagem e runtime:**

- JavaScript (Node.js 20, módulos CommonJS)

**Bibliotecas principais (ambas as APIs):**

| Biblioteca               | Uso                                                        |
| ------------------------ | ---------------------------------------------------------- |
| `express` ^5             | Framework HTTP / roteamento                                |
| `sequelize` ^6 + `mysql2`| ORM e driver MySQL                                         |
| `express-jwt` + `jwks-rsa`| Validação de JWT (Bearer) e busca das chaves públicas (JWKS) |
| `dotenv`                 | Variáveis de ambiente                                      |
| `joi` *(API Principal)*  | Validação de payloads                                      |
| `uuid` *(API Principal)* | Geração dos números de série das cópias únicas             |
| `sequelize-cli` *(API Principal)* | Migrations e seeders                              |

**Dependências de desenvolvimento:** `jest` + `supertest` (testes de integração HTTP),
`jsonwebtoken` (assinatura de tokens de teste), `nodemon`.

**Infraestrutura (imagens Docker):**

- MySQL `8.0`
- Keycloak `26.3.2`
- Nginx `alpine`

---

## c. Instalação e execução

### 1. Configurar variáveis de ambiente

Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

### 2. Subir o ambiente (Docker)

```bash
docker compose up --build
```

> Use `--build` na primeira execução. A ordem de inicialização é orquestrada pelo
> Compose: o `db-init` roda migrations + seeders (`npm run db:init`) e só então a
> API Principal sobe. O Keycloak leva ~30–60s para iniciar e importar o realm.

**Portas:** nginx `80`, API Principal `3000` (interna), Serviço de Relatórios `3001`
(interna), Keycloak `8080`, MySQL `3307` (host) → `3306` (contêiner).

Todo o tráfego de API passa pelo **nginx na porta 80**: `/api/relatorios/*` é roteado
para o Serviço de Relatórios e o restante para a API Principal.

### 3. Obter um token de acesso

As rotas exigem `Authorization: Bearer <token>`. Usuários de teste importados no realm:

| Usuário    | Senha         | Roles                  | Acesso                                  |
| ---------- | ------------- | ---------------------- | --------------------------------------- |
| `gerente`  | `gerente123`  | `vendas`, `relatorios` | API Principal **e** Relatórios          |
| `vendedor` | `vendedor123` | `vendas`               | apenas API Principal (Relatórios → 403) |

```bash
ACCESS_TOKEN=$(curl -s \
  -d "grant_type=password" \
  -d "client_id=ebookstore-app" \
  -d "username=gerente" \
  -d "password=gerente123" \
  http://localhost:8080/realms/ebookstore/protocol/openid-connect/token \
  | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

# API Principal (via nginx)
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost/catalogo

# Serviço de Relatórios
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost/api/relatorios/mais-vendidos
```

Sem token → `401`; token válido sem a role exigida → `403`.

### 4. Postman

A coleção `postman_collection.json` já vem configurada: rode **Autenticação (Keycloak) →
Login - gerente** (o `access_token` é salvo automaticamente) e as demais requisições
herdam o Bearer. Pastas: Clientes, Vendedores, Catálogo, Vendas e Relatórios.

### 5. Testes automatizados

Testes de integração HTTP (Jest + Supertest) que exercitam a cadeia real de
autenticação/autorização. Um servidor JWKS local assina tokens RS256 de teste, então
**não é preciso Keycloak nem banco** (a camada de serviço é mockada).

```bash
# API Principal
cd api-principal && npm install && npm test

# Serviço de Relatórios
cd servico-relatorios && npm install && npm test
```

### Reset do banco

Como o MySQL persiste em `./data/mysql` (bind mount), para recriar o schema do zero
(ex.: após mudança de migrations) é preciso apagar esse diretório:

```bash
docker compose down
rm -rf ./data/mysql      # PowerShell: Remove-Item -Recurse -Force .\data\mysql
docker compose up --build
```

---

## d. Arquitetura, estratégia e algoritmos

### Visão geral

```
                 ┌─────────────┐
   Cliente ───►  │   nginx :80 │  (gateway / reverse proxy)
                 └──────┬──────┘
            /api/relatorios │ │ /*
                 ┌─────────▼─┐ └─▼──────────────┐
                 │ Serviço de│   │ API Principal │
                 │ Relatórios│   │   (:3000)     │
                 │  (:3001)  │   └──────┬────────┘
                 └─────┬─────┘          │
                       │   ┌────────────▼───┐    ┌──────────────┐
                       └──►│   MySQL :3306  │    │ Keycloak :8080│
                           └────────────────┘    │ (OIDC/JWKS)  │
                                                  └──────────────┘
```

- **nginx** — ponto único de entrada; roteia por caminho para cada serviço.
- **API Principal** — CRUD de clientes, vendedores, **catálogo** e o ciclo de **vendas**.
- **Serviço de Relatórios** — somente leitura; gera relatórios analíticos via SQL.
- **MySQL** — base compartilhada. O serviço de relatórios usa um usuário **somente leitura**
  (`DB_USER_READ`), aplicando o princípio do menor privilégio.
- **Keycloak** — provedor de identidade; emite os JWTs.

### Autenticação e autorização (estratégia)

Ambas as APIs são **Resource Servers OAuth2/OIDC stateless**: cada requisição valida
**localmente** o `Bearer token` (assinatura via JWKS do Keycloak, além de `iss`, `aud`
e expiração) — não há sessão no servidor. A autorização é **RBAC baseada em roles de
realm**: a API Principal exige a role `vendas`; o Serviço de Relatórios exige `relatorios`.

> Detalhe de rede: os tokens são emitidos com `iss = http://localhost:8080/...` (como o
> cliente acessa o Keycloak), enquanto as APIs buscam as chaves em `http://keycloak:8080/...`
> (rede interna do Docker). Por isso `KEYCLOAK_ISSUER` e `KEYCLOAK_JWKS_URI` são separados.

### Organização em camadas (API Principal)

`routes → controllers → services → repositories → models`, com `middleware` transversal
(autenticação, autorização, validação Joi, tratamento de erros). Essa separação isola
roteamento, regra de negócio e acesso a dados.

### Padrões de projeto utilizados

- **Repository** — `*Repository.js` encapsulam o acesso ao banco (Sequelize), isolando
  os serviços dos detalhes de persistência.
- **Service Layer** — `*Service.js` concentram a regra de negócio (ex.: transações de venda,
  bloqueio de exclusão de produto).
- **Factory** — `VendaFactory` monta o objeto de venda: valida cada produto, calcula
  subtotais e total, e define o status inicial.
- **Observer** — um `EventEmitter` central (`utils/eventEmitter.js`, com `emitAsync` que
  aguarda listeners assíncronos) desacopla a venda de seus efeitos colaterais. O
  `VendaService` emite eventos e dois *listeners* reagem:
  - `licenciamentoListener` (eventos `venda.confirmada` / `venda.cancelada`) — gera/revoga
    as cópias únicas;
  - `emailListener` (evento `venda.entregue`) — entrega as chaves por e-mail (simulado).
- **Strategy** — no Serviço de Relatórios, `RelatorioService` recebe uma estratégia de
  relatório (`MaisVendidosStrategy`, `PorClienteStrategy`, `ConsumoMedioStrategy`) e
  executa `strategy.execute()`, permitindo trocar o algoritmo de consulta sem alterar
  o serviço.

### Algoritmos e fluxos principais

**Catálogo de ebooks (sem estoque).** O produto tem a flag `emCatalogo`. As regras:
- *Tirar do catálogo* (`PATCH /catalogo/:id/remover-catalogo`) apenas marca `emCatalogo = false`
  (reversível, sempre permitido) — o produto não é vendável, mas o registro permanece.
- *Exclusão definitiva* (`DELETE /catalogo/:id`) só é permitida se **não houver venda
  associada**; havendo, a API responde **409 Conflict** e orienta a tirar do catálogo.
- *Reincluir* (`PATCH /catalogo/:id/reativar`) volta `emCatalogo = true`.

**Ciclo de vida da venda (transacional).** Estados: `pendente → confirmada → cancelada`.
- *Criar* — a `VendaFactory` valida produtos (precisam estar em catálogo), calcula totais
  e persiste a venda como `pendente` dentro de uma transação.
- *Confirmar* — dentro de uma transação, muda o status e emite `venda.confirmada`; o
  `licenciamentoListener` gera **uma `Propriedade` por cópia adquirida**, cada uma com um
  **número de série único (UUID v4)** — a "chave" do ebook. Após o **commit**, emite
  `venda.entregue` (fora da transação) para o envio das chaves por e-mail.
- *Cancelar* — muda o status e emite `venda.cancelada`; o listener **revoga** as
  `Propriedade`s daquela venda.

**Entrega simulada de chaves por e-mail.** O `emailListener` consome `venda.entregue`,
busca as `Propriedade`s da venda (com cliente e produto) e chama o `EmailService`, que
**simula** o envio (sem SMTP real) registrando no log o destinatário, o assunto e a lista
de títulos + chaves. Roda **após o commit**, então o cliente só é notificado depois da
venda persistida; falhas de envio são apenas logadas e **não desfazem** a venda.

**Relatórios (Strategy + SQL agregado).** Consultas somente leitura:
- *Mais vendidos* — `SUM(quantidade)` por produto em vendas `confirmada`, ordenado desc.
- *Por cliente* — lista as cópias (título, número de série, data) que um cliente possui.
- *Consumo médio* — total gasto, número de pedidos e **ticket médio** por cliente.

### Resumo das rotas

| Serviço       | Rotas                                                                                   | Role         |
| ------------- | --------------------------------------------------------------------------------------- | ------------ |
| API Principal | `/clientes`, `/vendedores`, `/catalogo`, `/vendas`                                      | `vendas`     |
| API Principal | `/catalogo/:id/remover-catalogo`, `/catalogo/:id/reativar` (PATCH)                      | `vendas`     |
| API Principal | `/vendas/:id/confirmar`, `/vendas/:id/cancelar` (PATCH)                                  | `vendas`     |
| Relatórios    | `/api/relatorios/mais-vendidos`, `/api/relatorios/cliente/:id`, `/api/relatorios/consumo-medio` | `relatorios` |

> `GET /health` em cada serviço é público (sem token).
