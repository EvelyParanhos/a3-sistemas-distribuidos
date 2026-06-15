const Venda = require('../models/Venda');
const ItemVenda = require('../models/ItemVenda');
const Produto = require('../models/Produto');

class VendaFactory {
  static async create(data) {
    const { clienteId, vendedorId, itens } = data;
    
    let total = 0;
    const itensProcessados = [];

    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId);
      if (!produto || !produto.emCatalogo) {
        throw new Error(`Produto ${item.produtoId} não encontrado ou fora do catálogo`);
      }

      const subtotal = Number(produto.preco) * item.quantidade;
      total += subtotal;

      itensProcessados.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal: subtotal.toFixed(2)
      });
    }

    return {
      clienteId,
      vendedorId,
      status: 'pendente',
      total: total.toFixed(2),
      itens: itensProcessados
    };
  }
}

module.exports = VendaFactory;
