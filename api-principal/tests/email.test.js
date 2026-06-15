// Mockamos apenas a camada de dados; o EmailService (simulação) roda de verdade
// e verificamos a saída pelo console. Não precisa de banco nem de Keycloak.
jest.mock('../src/models/Propriedade', () => ({ findAll: jest.fn() }));

const eventEmitter = require('../src/utils/eventEmitter');
const Propriedade = require('../src/models/Propriedade');
const emailListener = require('../src/listeners/emailListener');

let logSpy;
let errSpy;

beforeEach(() => {
  jest.clearAllMocks();
  // Garante exatamente um observer registrado por teste (o emitter é singleton).
  eventEmitter.removeAllListeners('venda.entregue');
  emailListener();
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  errSpy.mockRestore();
});

const saidaLog = () => logSpy.mock.calls.map((c) => c.join(' ')).join('\n');

describe('Envio simulado de chaves por e-mail', () => {
  test('venda.entregue → "envia" e-mail com cliente, título e chave de cada cópia', async () => {
    Propriedade.findAll.mockResolvedValue([
      { numeroSerie: 'KEY-AAA', Cliente: { nome: 'João Silva', email: 'joao@email.com' }, Produto: { titulo: 'Dom Casmurro' } },
      { numeroSerie: 'KEY-BBB', Cliente: { nome: 'João Silva', email: 'joao@email.com' }, Produto: { titulo: 'O Cortiço' } },
    ]);

    await eventEmitter.emitAsync('venda.entregue', { vendaId: 10 });

    const saida = saidaLog();
    expect(saida).toContain('E-MAIL (SIMULADO)');
    expect(saida).toContain('joao@email.com');
    expect(saida).toContain('pedido #10');
    expect(saida).toContain('Dom Casmurro');
    expect(saida).toContain('KEY-AAA');
    expect(saida).toContain('O Cortiço');
    expect(saida).toContain('KEY-BBB');
  });

  test('venda sem propriedades → não envia nada', async () => {
    Propriedade.findAll.mockResolvedValue([]);

    await eventEmitter.emitAsync('venda.entregue', { vendaId: 11 });

    expect(saidaLog()).not.toContain('E-MAIL (SIMULADO)');
  });

  test('falha na consulta não derruba o fluxo (erro é apenas registrado)', async () => {
    Propriedade.findAll.mockRejectedValue(new Error('db indisponível'));

    await expect(
      eventEmitter.emitAsync('venda.entregue', { vendaId: 12 })
    ).resolves.toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
  });
});
