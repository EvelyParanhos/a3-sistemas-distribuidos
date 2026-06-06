const { Sequelize } = require('sequelize');
const RelatorioStrategy = require('./RelatorioStrategy');
const sequelize = require('../database');

class ConsumoMedioStrategy extends RelatorioStrategy {
  async execute() {
    const query = `
      SELECT c.nome, 
             SUM(v.total) as total_gasto, 
             COUNT(v.id) as total_pedidos,
             (SUM(v.total) / COUNT(v.id)) as ticket_medio
      FROM clientes c
      JOIN vendas v ON c.id = v.clienteId
      WHERE v.status = 'confirmada'
      GROUP BY c.id, c.nome
    `;
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
  }
}

module.exports = ConsumoMedioStrategy;
