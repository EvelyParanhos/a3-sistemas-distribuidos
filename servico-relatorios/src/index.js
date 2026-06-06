const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./database');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/relatorios', require('./routes/relatorioRoutes'));

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
