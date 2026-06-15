const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const { authenticate, authorize } = require('./middleware/auth');
const licenciamentoListener = require('./listeners/licenciamentoListener');
const emailListener = require('./listeners/emailListener');

dotenv.config();

// Initialize listeners
licenciamentoListener();
emailListener();

const app = express();

app.use(express.json());

// Health check público (sem autenticação) — usado pelo gateway/monitoramento.
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes — protegidas: exigem Bearer token válido (Keycloak) + role 'vendas'.
app.use('/vendas', authenticate, authorize('vendas'), require('./routes/vendaRoutes'));
app.use('/catalogo', authenticate, authorize('vendas'), require('./routes/catalogoRoutes'));
app.use('/clientes', authenticate, authorize('vendas'), require('./routes/clienteRoutes'));
app.use('/vendedores', authenticate, authorize('vendas'), require('./routes/vendedorRoutes'));

// Error handling
app.use(errorHandler);

module.exports = app;
