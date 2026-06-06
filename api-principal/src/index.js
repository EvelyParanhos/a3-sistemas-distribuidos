const app = require('./app');
const sequelize = require('./database');

const PORT = process.env.API_PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log(`API Principal running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to database:', err));
