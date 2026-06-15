const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

jest.mock('../src/services/VendaService', () => ({
  create: jest.fn(),
  list: jest.fn(),
  confirm: jest.fn(),
  cancel: jest.fn(),
}));
const VendaService = require('../src/services/VendaService');

let app;
let token;

beforeAll(async () => {
  await startJwksServer();
  app = require('../src/app');
  token = signToken({ roles: ['vendas'] });
});

afterAll(async () => {
  await stopJwksServer();
});

beforeEach(() => jest.clearAllMocks());

const auth = (req) => req.set('Authorization', `Bearer ${token}`);
const vendaPayload = { clienteId: 1, vendedorId: 1, itens: [{ produtoId: 1, quantidade: 2 }] };

describe('Vendas (api-principal)', () => {
  test('POST /vendas válido → 201', async () => {
    VendaService.create.mockResolvedValue({ id: 10, status: 'pendente' });
    const res = await auth(request(app).post('/vendas')).send(vendaPayload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 10 });
  });

  test('POST /vendas sem itens → 400', async () => {
    const res = await auth(request(app).post('/vendas')).send({ clienteId: 1, vendedorId: 1, itens: [] });
    expect(res.status).toBe(400);
    expect(VendaService.create).not.toHaveBeenCalled();
  });

  test('GET /vendas → 200', async () => {
    VendaService.list.mockResolvedValue([{ id: 10 }]);
    const res = await auth(request(app).get('/vendas'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('PATCH /vendas/:id/confirmar com ebook fora do catálogo → 422', async () => {
    VendaService.confirm.mockRejectedValue(new Error('O ebook "X" não está mais disponível para venda.'));
    const res = await auth(request(app).patch('/vendas/10/confirmar'));
    expect(res.status).toBe(422);
  });

  test('PATCH /vendas/:id/cancelar → 200', async () => {
    VendaService.cancel.mockResolvedValue({ id: 10, status: 'cancelada' });
    const res = await auth(request(app).patch('/vendas/10/cancelar'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'cancelada' });
  });
});
