# a3-sistemas-distribuidos

Sistema distribuído EbookStore composto por duas APIs (API Principal e Serviço de Relatórios),
um gateway nginx, banco MySQL e **Keycloak** como provedor de identidade (autenticação/autorização).

## Como rodar

- Desenvolvimento: `docker compose up --build`
- Produção: `docker compose -f compose.yaml up -d --build`

> Use `--build` na primeira execução após adicionar a autenticação, para que as novas
> dependências (`express-jwt`, `jwks-rsa`) sejam instaladas nas imagens.

Portas: nginx `80`, API Principal `3000`, Serviço de Relatórios `3001`, Keycloak `8080`, MySQL `3306`.

O Keycloak leva ~30–60s para iniciar e importar o realm. As APIs sobem antes dele e buscam as
chaves públicas (JWKS) na primeira requisição autenticada — basta aguardar o Keycloak ficar pronto.

## Autenticação (Keycloak)

As duas APIs são **Resource Servers OAuth2/OIDC**: cada requisição precisa de um
`Authorization: Bearer <access_token>` válido. O token é validado localmente (assinatura via
JWKS, `iss`, `aud` e expiração) — não há sessão no servidor (stateless).

A autorização é **baseada em roles de realm**, por serviço:

| Serviço               | Rotas protegidas       | Role exigida  |
| --------------------- | ---------------------- | ------------- |
| API Principal         | `/clientes`, `/vendedores`, `/estoque`, `/vendas` | `vendas`     |
| Serviço de Relatórios | `/api/relatorios/*`    | `relatorios`  |

> `GET /health` em cada serviço é público (sem token).

### Realm importado automaticamente

O realm `ebookstore` é importado de `keycloak/import/ebookstore-realm.json` no start do Keycloak:

- **Client:** `ebookstore-app` (público, Password Grant habilitado para testes; audience `ebookstore-api`)
- **Roles de realm:** `vendas`, `relatorios`
- **Usuários de teste:**

| Usuário    | Senha         | Roles                  | Acessa                              |
| ---------- | ------------- | ---------------------- | ----------------------------------- |
| `gerente`  | `gerente123`  | `vendas`, `relatorios` | API Principal **e** Relatórios      |
| `vendedor` | `vendedor123` | `vendas`               | apenas API Principal (Relatórios → 403) |

Console admin do Keycloak: http://localhost:8080 (usuário/senha do `.env`: `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`).

### Obter um token (curl)

```bash
# Login como gerente
ACCESS_TOKEN=$(curl -s \
  -d "grant_type=password" \
  -d "client_id=ebookstore-app" \
  -d "username=gerente" \
  -d "password=gerente123" \
  http://localhost:8080/realms/ebookstore/protocol/openid-connect/token \
  | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

# Chamar a API Principal (via gateway nginx na porta 80)
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost/clientes

# Chamar o Serviço de Relatórios
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost/api/relatorios/mais-vendidos
```

Sem token (ou inválido/expirado) → `401 Unauthorized`. Token válido mas sem a role exigida → `403 Forbidden`.

### Postman

A coleção `postman_collection.json` já vem configurada:

1. Rode **Autenticação (Keycloak) → Login - gerente** (ou *Login - vendedor*). O `access_token` é salvo automaticamente.
2. As demais requisições usam esse token como Bearer (herdado no nível da coleção).
3. Para demonstrar o RBAC: faça login como `vendedor` e chame um relatório — retorna `403`.

## Notas de arquitetura

- **Issuer vs. JWKS:** os tokens são emitidos com `iss = http://localhost:8080/...` (como o cliente
  acessa o Keycloak), enquanto as APIs buscam as chaves em `http://keycloak:8080/...` (rede interna
  do Docker). Por isso `KEYCLOAK_ISSUER` e `KEYCLOAK_JWKS_URI` são variáveis separadas.
- **Revogação:** tokens são stateless e válidos até expirar (`accessTokenLifespan` = 5 min no realm).
  Para revogação imediata, reduza o lifespan e use refresh tokens (ou introspection).
