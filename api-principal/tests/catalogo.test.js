const request = require('supertest');
const { startJwksServer, stopJwksServer, signToken } = require('./helpers/keycloak');

jest.mock('../src/services/CatalogoService', () => ({
  list: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removerDoCatalogo: jest.fn(),
  reincluirNoCatalogo: jest.fn(),
}));
const CatalogoService = require('../src/services/CatalogoService');

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
const produtoPayload = {
  titulo: 'Dom Casmurro',
  autor: 'Machado de Assis',
  genero: 'Romance',
  descricao: 'Clássico da literatura brasileira',
  preco: 39.9,
};

describe('Catálogo (api-principal)', () => {
  test('POST /catalogo válido → 201 e chama o service', async () => {
    CatalogoService.create.mockResolvedValue({ id: 1, ...produtoPayload, emCatalogo: true });
    const res = await auth(request(app).post('/catalogo')).send(produtoPayload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, titulo: 'Dom Casmurro' });
    expect(CatalogoService.create).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: 'Dom Casmurro', preco: 39.9 })
    );
  });

  test('POST /catalogo inválido → 400 (Joi) e NÃO chama o service', async () => {
    const res = await auth(request(app).post('/catalogo')).send({ titulo: 'Sem autor/genero/preco' });
    expect(res.status).toBe(400);
    expect(CatalogoService.create).not.toHaveBeenCalled();
  });

  test('POST /catalogo não aceita campos de estoque → 400', async () => {
    const res = await auth(request(app).post('/catalogo'))
      .send({ ...produtoPayload, quantidadeEstoque: 10 });
    expect(res.status).toBe(400);
    expect(CatalogoService.create).not.toHaveBeenCalled();
  });

  test('GET /catalogo → 200 com lista', async () => {
    CatalogoService.list.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await auth(request(app).get('/catalogo'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('PUT /catalogo/:id → 200', async () => {
    CatalogoService.update.mockResolvedValue({ id: 1, ...produtoPayload, preco: 44.9 });
    const res = await auth(request(app).put('/catalogo/1')).send({ ...produtoPayload, preco: 44.9 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ preco: 44.9 });
    expect(CatalogoService.update).toHaveBeenCalledWith('1', expect.objectContaining({ preco: 44.9 }));
  });

  test('DELETE /catalogo/:id sem vendas associadas → 204', async () => {
    CatalogoService.remove.mockResolvedValue();
    const res = await auth(request(app).delete('/catalogo/1'));
    expect(res.status).toBe(204);
    expect(CatalogoService.remove).toHaveBeenCalledWith('1');
  });

  test('DELETE /catalogo/:id com venda associada → 409', async () => {
    CatalogoService.remove.mockRejectedValue(
      new Error('Não é possível excluir um produto com vendas associadas. Tire-o do catálogo.')
    );
    const res = await auth(request(app).delete('/catalogo/1'));
    expect(res.status).toBe(409);
  });

  test('PATCH /catalogo/:id/remover-catalogo → 200 e tira do catálogo', async () => {
    CatalogoService.removerDoCatalogo.mockResolvedValue({ id: 1, emCatalogo: false });
    const res = await auth(request(app).patch('/catalogo/1/remover-catalogo'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ emCatalogo: false });
    expect(CatalogoService.removerDoCatalogo).toHaveBeenCalledWith('1');
  });

  test('PATCH /catalogo/:id/reativar → 200 e reinclui no catálogo', async () => {
    CatalogoService.reincluirNoCatalogo.mockResolvedValue({ id: 1, emCatalogo: true });
    const res = await auth(request(app).patch('/catalogo/1/reativar'));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ emCatalogo: true });
    expect(CatalogoService.reincluirNoCatalogo).toHaveBeenCalledWith('1');
  });
});
