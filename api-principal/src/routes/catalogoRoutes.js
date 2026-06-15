const express = require('express');
const router = express.Router();
const CatalogoController = require('../controllers/CatalogoController');
const validateSchema = require('../middleware/validateSchema');
const Joi = require('joi');

const produtoSchema = Joi.object({
  titulo: Joi.string().required(),
  autor: Joi.string().required(),
  genero: Joi.string().required(),
  descricao: Joi.string().optional(),
  preco: Joi.number().min(0).required(),
  emCatalogo: Joi.boolean().default(true)
});

router.get('/', CatalogoController.list);
router.post('/', validateSchema(produtoSchema), CatalogoController.create);
router.put('/:id', validateSchema(produtoSchema), CatalogoController.update);
// Exclusão definitiva (bloqueada se houver venda associada).
router.delete('/:id', CatalogoController.delete);
// Tira do catálogo sem excluir (reversível) / reinclui no catálogo.
router.patch('/:id/remover-catalogo', CatalogoController.removerDoCatalogo);
router.patch('/:id/reativar', CatalogoController.reincluirNoCatalogo);

module.exports = router;
