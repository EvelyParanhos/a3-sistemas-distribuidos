const express = require('express');
const router = express.Router();
const VendedorController = require('../controllers/VendedorController');
const validateSchema = require('../middleware/validateSchema');
const Joi = require('joi');

const vendedorSchema = Joi.object({
  nome: Joi.string().max(150).required(),
  email: Joi.string().email().max(150).required(),
  cpf: Joi.string().length(11).required(),
  telefone: Joi.string().max(20).optional(),
  comissaoPercentual: Joi.number().min(0).max(100).optional()
});

router.post('/', validateSchema(vendedorSchema), VendedorController.create);
router.get('/', VendedorController.list);
router.get('/:id', VendedorController.findById);
router.put('/:id', validateSchema(vendedorSchema), VendedorController.update);
router.delete('/:id', VendedorController.delete);

module.exports = router;
