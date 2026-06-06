const EstoqueService = require('../services/EstoqueService');

class EstoqueController {
  static async list(req, res, next) {
    try {
      const produtos = await EstoqueService.list();
      res.status(200).json(produtos);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const produto = await EstoqueService.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const produto = await EstoqueService.update(req.params.id, req.body);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await EstoqueService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async reactivate(req, res, next) {
    try {
      const produto = await EstoqueService.reactivate(req.params.id);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EstoqueController;
