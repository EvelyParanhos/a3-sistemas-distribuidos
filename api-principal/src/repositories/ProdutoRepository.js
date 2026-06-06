const Produto = require('../models/Produto');
const { Op } = require('sequelize');

class ProdutoRepository {
  static async create(data) {
    return Produto.create(data);
  }

  static async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { ativo: true };
    return Produto.findAll({ where });
  }

  static async findById(id) {
    return Produto.findByPk(id);
  }

  static async update(id, data) {
    const produto = await Produto.findByPk(id);
    if (!produto) throw new Error('Produto não encontrado');
    return produto.update(data);
  }

  static async softDelete(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) throw new Error('Produto não encontrado');
    produto.ativo = false;
    await produto.save();
    return produto.destroy(); // Sequelize paranoid will set deletedAt
  }

  static async restore(id) {
    const produto = await Produto.findByPk(id, { paranoid: false });
    if (!produto) throw new Error('Produto não encontrado');
    produto.ativo = true;
    await produto.save();
    return produto.restore();
  }
}

module.exports = ProdutoRepository;
