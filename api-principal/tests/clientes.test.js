const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

jest.mock('../src/services/ClienteService', () => ({
  create: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
const ClienteService = require('../src/services/ClienteService');

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
const clientePayload = {
  nome: 'João Silva',
  email: 'joao@email.com',
  cpf: '12345678901',
  telefone: '11999999999',
};

describe('Clientes (api-principal)', () => {
  test('POST /clientes válido → 201 e chama o service', async () => {
    ClienteService.create.mockResolvedValue({ id: 1, ...clientePayload });
    const res = await auth(request(app).post('/clientes')).send(clientePayload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, nome: 'João Silva' });
    expect(ClienteService.create).toHaveBeenCalledWith(
      expect.objectContaining({ cpf: '12345678901' })
    );
  });

  test('POST /clientes inválido → 400 (Joi) e NÃO chama o service', async () => {
    const res = await auth(request(app).post('/clientes')).send({ nome: 'Sem email/cpf' });
    expect(res.status).toBe(400);
    expect(ClienteService.create).not.toHaveBeenCalled();
  });

  test('GET /clientes → 200 com lista', async () => {
    ClienteService.list.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await auth(request(app).get('/clientes'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('GET /clientes/:id inexistente → 404', async () => {
    ClienteService.findById.mockResolvedValue(null);
    const res = await auth(request(app).get('/clientes/999'));
    expect(res.status).toBe(404);
  });

  test('DELETE /clientes/:id → 204', async () => {
    ClienteService.remove.mockResolvedValue();
    const res = await auth(request(app).delete('/clientes/1'));
    expect(res.status).toBe(204);
    expect(ClienteService.remove).toHaveBeenCalledWith('1');
  });
});
