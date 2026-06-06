const express = require('express');
const router = express.Router();
const EstoqueController = require('../controllers/EstoqueController');
const validateSchema = require('../middleware/validateSchema');
const Joi = require('joi');

const produtoSchema = Joi.object({
  titulo: Joi.string().required(),
  autor: Joi.string().required(),
  genero: Joi.string().required(),
  descricao: Joi.string().optional(),
  preco: Joi.number().min(0).required(),
  quantidadeEstoque: Joi.number().min(0).required(),
  estoqueMinimo: Joi.number().min(0).default(5)
});

router.get('/', EstoqueController.list);
router.post('/', validateSchema(produtoSchema), EstoqueController.create);
router.put('/:id', validateSchema(produtoSchema), EstoqueController.update);
router.delete('/:id', EstoqueController.delete);
router.patch('/:id/reativar', EstoqueController.reactivate);

module.exports = router;
