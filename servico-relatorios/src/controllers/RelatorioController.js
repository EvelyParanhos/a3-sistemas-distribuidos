const RelatorioService = require('../services/RelatorioService');
const MaisVendidosStrategy = require('../strategies/MaisVendidosStrategy');
const BaixoEstoqueStrategy = require('../strategies/BaixoEstoqueStrategy');
const PorClienteStrategy = require('../strategies/PorClienteStrategy');
const ConsumoMedioStrategy = require('../strategies/ConsumoMedioStrategy');

class RelatorioController {
  static async getMaisVendidos(req, res, next) {
    try {
      const service = new RelatorioService(new MaisVendidosStrategy());
      const data = await service.generate();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getBaixoEstoque(req, res, next) {
    try {
      const service = new RelatorioService(new BaixoEstoqueStrategy());
      const data = await service.generate();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getPorCliente(req, res, next) {
    try {
      const service = new RelatorioService(new PorClienteStrategy(req.params.clienteId));
      const data = await service.generate();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getConsumoMedio(req, res, next) {
    try {
      const service = new RelatorioService(new ConsumoMedioStrategy());
      const data = await service.generate();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RelatorioController;
