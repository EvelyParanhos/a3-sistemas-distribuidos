const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const validateSchema = require('../middleware/validateSchema');
const Joi = require('joi');

const clienteSchema = Joi.object({
  nome: Joi.string().max(150).required(),
  email: Joi.string().email().max(150).required(),
  cpf: Joi.string().length(11).required(),
  telefone: Joi.string().max(20).optional(),
  endereco: Joi.string().max(255).optional()
});

router.post('/', validateSchema(clienteSchema), ClienteController.create);
router.get('/', ClienteController.list);
router.get('/:id', ClienteController.findById);
router.put('/:id', validateSchema(clienteSchema), ClienteController.update);
router.delete('/:id', ClienteController.delete);

module.exports = router;
