const Cliente = require('../models/Cliente');

class ClienteRepository {
  static async create(data) {
    return Cliente.create(data);
  }

  static async findAll() {
    return Cliente.findAll();
  }

  static async findById(id) {
    return Cliente.findByPk(id);
  }

  static async update(id, data) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) throw new Error('Cliente não encontrado');
    return cliente.update(data);
  }

  static async delete(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) throw new Error('Cliente não encontrado');
    return cliente.destroy();
  }
}

module.exports = ClienteRepository;
