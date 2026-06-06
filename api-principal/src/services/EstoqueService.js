const ProdutoRepository = require('../repositories/ProdutoRepository');

class EstoqueService {
  static async list() {
    return ProdutoRepository.findAll();
  }

  static async create(data) {
    return ProdutoRepository.create(data);
  }

  static async update(id, data) {
    return ProdutoRepository.update(id, data);
  }

  static async remove(id) {
    // Check for associated sales would be done here if needed
    return ProdutoRepository.softDelete(id);
  }

  static async reactivate(id) {
    return ProdutoRepository.restore(id);
  }
}

module.exports = EstoqueService;
