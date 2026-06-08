const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

// `mock`-prefixado para ser permitido dentro da factory hoisteada do jest.mock.
const mockGenerate = jest.fn();
jest.mock('../src/services/RelatorioService', () =>
  jest.fn().mockImplementation(() => ({ generate: mockGenerate }))
);

let app;
let token;

beforeAll(async () => {
  await startJwksServer();
  app = require('../src/app');
  token = signToken({ roles: ['relatorios'] });
});

afterAll(async () => {
  await stopJwksServer();
});

beforeEach(() => mockGenerate.mockReset());

const auth = (req) => req.set('Authorization', `Bearer ${token}`);

describe('Relatórios (servico-relatorios)', () => {
  test('GET /mais-vendidos → 200 com dados', async () => {
    mockGenerate.mockResolvedValue([{ titulo: 'Dom Casmurro', total_vendido: '2' }]);
    const res = await auth(request(app).get('/api/relatorios/mais-vendidos'));
    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ titulo: 'Dom Casmurro' });
  });

  test('GET /baixo-estoque → 200', async () => {
    mockGenerate.mockResolvedValue([]);
    const res = await auth(request(app).get('/api/relatorios/baixo-estoque'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /cliente/:id → 200', async () => {
    mockGenerate.mockResolvedValue([{ titulo: 'X', numeroSerie: 'abc-123' }]);
    const res = await auth(request(app).get('/api/relatorios/cliente/1'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET /consumo-medio → 200', async () => {
    mockGenerate.mockResolvedValue([{ titulo: 'Y', media: 1.5 }]);
    const res = await auth(request(app).get('/api/relatorios/consumo-medio'));
    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ titulo: 'Y' });
  });

  test('propaga erro do service → 500', async () => {
    mockGenerate.mockRejectedValue(new Error('falha de query'));
    const res = await auth(request(app).get('/api/relatorios/consumo-medio'));
    expect(res.status).toBe(500);
  });
});
