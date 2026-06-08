const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./database');
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

const PORT = process.env.RELATORIOS_PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected (Read-only)...');
    app.listen(PORT, () => {
      console.log(`Serviço de Relatórios running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to database:', err));

module.exports = app;
