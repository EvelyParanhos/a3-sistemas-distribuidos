const VendedorRepository = require('../repositories/VendedorRepository');

class VendedorService {
  static async create(data) {
    return VendedorRepository.create(data);
  }

  static async list() {
    return VendedorRepository.findAll();
  }

  static async findById(id) {
    return VendedorRepository.findById(id);
  }

  static async update(id, data) {
    return VendedorRepository.update(id, data);
  }

  static async remove(id) {
    return VendedorRepository.delete(id);
  }
}

module.exports = VendedorService;
