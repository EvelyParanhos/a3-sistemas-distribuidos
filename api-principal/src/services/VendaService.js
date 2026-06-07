const VendaRepository = require('../repositories/VendaRepository');
const VendaFactory = require('../factories/VendaFactory');
const eventEmitter = require('../utils/eventEmitter');
const sequelize = require('../database');

class VendaService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const vendaData = await VendaFactory.create(data);
      const venda = await VendaRepository.create(vendaData, transaction);
      await transaction.commit();
      return venda;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async confirm(id) {
    const transaction = await sequelize.transaction();
    try {
      const venda = await VendaRepository.findById(id, transaction);
      if (!venda) throw new Error('Venda não encontrada');
      if (venda.status !== 'pendente') throw new Error('Somente vendas pendentes podem ser confirmadas');

      await VendaRepository.updateStatus(id, 'confirmada', transaction);
      
      // Emitir evento passando clienteId e vendaId para gerar as "Propriedades" (Cópias Únicas)
      // Precisa ser aguardado: o listener usa essa mesma transaction, então tem
      // que terminar antes do commit (senão a query roda sobre uma transaction
      // já finalizada e derruba o processo).
      await eventEmitter.emitAsync('venda.confirmada', {
        itens: venda.itens,
        transaction,
        clienteId: venda.clienteId,
        vendaId: venda.id
      });

      await transaction.commit();
      return await VendaRepository.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async cancel(id) {
    const transaction = await sequelize.transaction();
    try {
      const venda = await VendaRepository.findById(id, transaction);
      if (!venda) throw new Error('Venda não encontrada');
      if (venda.status === 'cancelada') throw new Error('Venda já está cancelada');

      await VendaRepository.updateStatus(id, 'cancelada', transaction);

      // Revoga as cópias únicas ao cancelar (aguardado pelo mesmo motivo do confirm)
      await eventEmitter.emitAsync('venda.cancelada', { vendaId: venda.id, transaction });

      await transaction.commit();
      return await VendaRepository.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async list() {
    return VendaRepository.findAll();
  }
}

module.exports = VendaService;
