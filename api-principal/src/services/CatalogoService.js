const ProdutoRepository = require('../repositories/ProdutoRepository');

class CatalogoService {
  static async list() {
    return ProdutoRepository.findAll();
  }

  static async create(data) {
    return ProdutoRepository.create(data);
  }

  static async update(id, data) {
    return ProdutoRepository.update(id, data);
  }

  // Tira do catálogo (reversível) — sempre permitido, não exclui o produto.
  static async removerDoCatalogo(id) {
    return ProdutoRepository.removerDoCatalogo(id);
  }

  static async reincluirNoCatalogo(id) {
    return ProdutoRepository.reincluirNoCatalogo(id);
  }

  // Exclusão definitiva: bloqueada se houver venda associada. Nesse caso o
  // produto só pode ser tirado do catálogo (removerDoCatalogo).
  static async remove(id) {
    const vendas = await ProdutoRepository.contarVendas(id);
    if (vendas > 0) {
      throw new Error('Não é possível excluir um produto com vendas associadas. Tire-o do catálogo.');
    }
    return ProdutoRepository.delete(id);
  }
}

module.exports = CatalogoService;
