const VendaService = require('../services/VendaService');

class VendaController {
  static async create(req, res, next) {
    try {
      const venda = await VendaService.create(req.body);
      res.status(201).json(venda);
    } catch (error) {
      next(error);
    }
  }

  static async confirm(req, res, next) {
    try {
      const venda = await VendaService.confirm(req.params.id);
      res.status(200).json(venda);
    } catch (error) {
      if (error.message.includes('Estoque insuficiente')) {
        error.statusCode = 422;
      }
      next(error);
    }
  }

  static async cancel(req, res, next) {
    try {
      const venda = await VendaService.cancel(req.params.id);
      res.status(200).json(venda);
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const vendas = await VendaService.list();
      res.status(200).json(vendas);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VendaController;
