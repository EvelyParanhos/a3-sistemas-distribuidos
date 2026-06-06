const Vendedor = require('../models/Vendedor');

class VendedorRepository {
  static async create(data) {
    return Vendedor.create(data);
  }

  static async findAll() {
    return Vendedor.findAll();
  }

  static async findById(id) {
    return Vendedor.findByPk(id);
  }

  static async update(id, data) {
    const vendedor = await Vendedor.findByPk(id);
    if (!vendedor) throw new Error('Vendedor não encontrado');
    return vendedor.update(data);
  }

  static async delete(id) {
    const vendedor = await Vendedor.findByPk(id);
    if (!vendedor) throw new Error('Vendedor não encontrado');
    return vendedor.destroy();
  }
}

module.exports = VendedorRepository;
