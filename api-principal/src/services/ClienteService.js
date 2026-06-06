const ClienteRepository = require('../repositories/ClienteRepository');

class ClienteService {
  static async create(data) {
    return ClienteRepository.create(data);
  }

  static async list() {
    return ClienteRepository.findAll();
  }

  static async findById(id) {
    return ClienteRepository.findById(id);
  }

  static async update(id, data) {
    return ClienteRepository.update(id, data);
  }

  static async remove(id) {
    return ClienteRepository.delete(id);
  }
}

module.exports = ClienteService;
