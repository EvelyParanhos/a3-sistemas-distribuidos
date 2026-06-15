const CatalogoService = require('../services/CatalogoService');

class CatalogoController {
  static async list(req, res, next) {
    try {
      const produtos = await CatalogoService.list();
      res.status(200).json(produtos);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const produto = await CatalogoService.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const produto = await CatalogoService.update(req.params.id, req.body);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await CatalogoService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      // Exclusão bloqueada por venda associada → 409 Conflict.
      if (error.message.includes('vendas associadas')) {
        error.statusCode = 409;
      }
      next(error);
    }
  }

  static async removerDoCatalogo(req, res, next) {
    try {
      const produto = await CatalogoService.removerDoCatalogo(req.params.id);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }

  static async reincluirNoCatalogo(req, res, next) {
    try {
      const produto = await CatalogoService.reincluirNoCatalogo(req.params.id);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CatalogoController;
