const Venda = require('../models/Venda');
const ItemVenda = require('../models/ItemVenda');
const Produto = require('../models/Produto');

class VendaRepository {
  static async create(vendaData, transaction) {
    const venda = await Venda.create(vendaData, { transaction });
    const itens = vendaData.itens.map(item => ({ ...item, vendaId: venda.id }));
    await ItemVenda.bulkCreate(itens, { transaction });
    return this.findById(venda.id, transaction);
  }

  static async findById(id, transaction) {
    return Venda.findByPk(id, {
      include: [{ model: ItemVenda, as: 'itens', include: [{ model: Produto, as: 'produto' }] }],
      transaction
    });
  }

  static async findAll() {
    return Venda.findAll({
      include: [{ model: ItemVenda, as: 'itens', include: [{ model: Produto, as: 'produto' }] }]
    });
  }

  static async updateStatus(id, status, transaction) {
    const venda = await Venda.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!venda) throw new Error('Venda não encontrada');
    const statusAnterior = venda.status;
    venda.status = status;
    await venda.save({ transaction });
    return statusAnterior;
  }
}

module.exports = VendaRepository;
