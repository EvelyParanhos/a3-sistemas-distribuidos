const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const { authenticate, authorize } = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(express.json());

// Health check público (sem autenticação) — usado pelo gateway/monitoramento.
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes — protegidas: exigem Bearer token válido (Keycloak) + role 'relatorios'.
app.use('/api/relatorios', authenticate, authorize('relatorios'), require('./routes/relatorioRoutes'));

// Error handling
app.use(errorHandler);

module.exports = app;
