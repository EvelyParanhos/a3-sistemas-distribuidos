const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');

router.get('/mais-vendidos', RelatorioController.getMaisVendidos);
router.get('/cliente/:clienteId', RelatorioController.getPorCliente);
router.get('/consumo-medio', RelatorioController.getConsumoMedio);

module.exports = router;
