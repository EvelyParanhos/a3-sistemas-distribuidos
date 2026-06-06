const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const estoqueListener = require('./listeners/estoqueListener');

dotenv.config();

// Initialize listeners
estoqueListener();

const app = express();

app.use(express.json());

// Routes
app.use('/vendas', require('./routes/vendaRoutes'));
app.use('/estoque', require('./routes/estoqueRoutes'));
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/vendedores', require('./routes/vendedorRoutes'));

// Error handling
app.use(errorHandler);

module.exports = app;
