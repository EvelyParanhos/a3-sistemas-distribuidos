const Produto = require('../models/Produto');
const ItemVenda = require('../models/ItemVenda');

class ProdutoRepository {
  static async create(data) {
    return Produto.create(data);
  }

  static async findAll(incluirForaCatalogo = false) {
    const where = incluirForaCatalogo ? {} : { emCatalogo: true };
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

  // Tira o produto do catálogo sem excluí-lo: ele deixa de ser vendável, mas o
  // registro (e as vendas/propriedades que o referenciam) permanece intacto.
  static async removerDoCatalogo(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) throw new Error('Produto não encontrado');
    produto.emCatalogo = false;
    return produto.save();
  }

  static async reincluirNoCatalogo(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) throw new Error('Produto não encontrado');
    produto.emCatalogo = true;
    return produto.save();
  }

  static async contarVendas(id) {
    return ItemVenda.count({ where: { produtoId: id } });
  }

  // Exclusão permanente: só permitida quando não há venda associada ao produto.
  static async delete(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) throw new Error('Produto não encontrado');
    return produto.destroy();
  }
}

module.exports = ProdutoRepository;
