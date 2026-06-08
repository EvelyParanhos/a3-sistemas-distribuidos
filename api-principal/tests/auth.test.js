const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

// Mocka o service para que a rota protegida responda sem tocar no banco —
// os testes focam na cadeia de autenticação/autorização.
jest.mock('../src/services/ClienteService', () => ({
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

let app;

beforeAll(async () => {
  await startJwksServer();        // define KEYCLOAK_JWKS_URI
  app = require('../src/app');     // auth.js lê as envs neste momento
});

afterAll(async () => {
  await stopJwksServer();
});

describe('Autenticação e autorização (api-principal)', () => {
  test('GET /health é público (200 sem token)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('sem token → 401', async () => {
    const res = await request(app).get('/clientes');
    expect(res.status).toBe(401);
  });

  test('token mal formado → 401', async () => {
    const res = await request(app)
      .get('/clientes')
      .set('Authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
  });

  test('assinatura válida mas issuer inválido → 401', async () => {
    const token = signToken({ roles: ['vendas'], issuer: 'http://evil.test/realms/x' });
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test('assinatura válida mas audience inválida → 401', async () => {
    const token = signToken({ roles: ['vendas'], audience: 'outra-api' });
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test('token expirado → 401', async () => {
    const token = signToken({ roles: ['vendas'], expiresIn: -10 });
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test('token válido sem a role exigida → 403', async () => {
    const token = signToken({ roles: ['relatorios'] });
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/role/i);
  });

  test('token válido com role vendas → 200', async () => {
    const token = signToken({ roles: ['vendas'] });
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
