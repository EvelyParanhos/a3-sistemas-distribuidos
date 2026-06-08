const app = require('./app');
const sequelize = require('./database');

const PORT = process.env.RELATORIOS_PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected (Read-only)...');
    app.listen(PORT, () => {
      console.log(`Serviço de Relatórios running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to database:', err));
