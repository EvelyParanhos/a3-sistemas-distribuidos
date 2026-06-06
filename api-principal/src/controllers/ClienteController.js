const ClienteService = require('../services/ClienteService');

class ClienteController {
  static async create(req, res, next) {
    try {
      const cliente = await ClienteService.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const clientes = await ClienteService.list();
      res.status(200).json(clientes);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const cliente = await ClienteService.findById(req.params.id);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      res.status(200).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const cliente = await ClienteService.update(req.params.id, req.body);
      res.status(200).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await ClienteService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClienteController;
