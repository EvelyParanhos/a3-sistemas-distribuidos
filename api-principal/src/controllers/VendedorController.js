const VendedorService = require('../services/VendedorService');

class VendedorController {
  static async create(req, res, next) {
    try {
      const vendedor = await VendedorService.create(req.body);
      res.status(201).json(vendedor);
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const vendedores = await VendedorService.list();
      res.status(200).json(vendedores);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const vendedor = await VendedorService.findById(req.params.id);
      if (!vendedor) {
        return res.status(404).json({ message: 'Vendedor não encontrado' });
      }
      res.status(200).json(vendedor);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const vendedor = await VendedorService.update(req.params.id, req.body);
      res.status(200).json(vendedor);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await VendedorService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VendedorController;
