const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

// Mocka o RelatorioService (classe) para responder sem tocar no banco.
jest.mock('../src/services/RelatorioService', () =>
  jest.fn().mockImplementation(() => ({
    generate: jest.fn().mockResolvedValue([]),
  }))
);

let app;

beforeAll(async () => {
  await startJwksServer();
  app = require('../src/app');
});

afterAll(async () => {
  await stopJwksServer();
});

describe('Autenticação e autorização (servico-relatorios)', () => {
  test('GET /health é público (200 sem token)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('sem token → 401', async () => {
    const res = await request(app).get('/api/relatorios/mais-vendidos');
    expect(res.status).toBe(401);
  });

  test('token mal formado → 401', async () => {
    const res = await request(app)
      .get('/api/relatorios/mais-vendidos')
      .set('Authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
  });

  test('issuer inválido → 401', async () => {
    const token = signToken({ roles: ['relatorios'], issuer: 'http://evil.test/realms/x' });
    const res = await request(app)
      .get('/api/relatorios/mais-vendidos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test('token válido com role vendas (sem relatorios) → 403', async () => {
    const token = signToken({ roles: ['vendas'] });
    const res = await request(app)
      .get('/api/relatorios/mais-vendidos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/relatorios/);
  });

  test('token válido com role relatorios → 200', async () => {
    const token = signToken({ roles: ['relatorios'] });
    const res = await request(app)
      .get('/api/relatorios/mais-vendidos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
