const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/VendaController');
const validateSchema = require('../middleware/validateSchema');
const Joi = require('joi');

const vendaSchema = Joi.object({
  clienteId: Joi.number().required(),
  vendedorId: Joi.number().required(),
  itens: Joi.array().items(Joi.object({
    produtoId: Joi.number().required(),
    quantidade: Joi.number().min(1).required()
  })).min(1).required()
});

router.post('/', validateSchema(vendaSchema), VendaController.create);
router.get('/', VendaController.list);
router.patch('/:id/confirmar', VendaController.confirm);
router.patch('/:id/cancelar', VendaController.cancel);

module.exports = router;
