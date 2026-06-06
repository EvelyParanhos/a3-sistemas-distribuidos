'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendedores', null, {});
    await queryInterface.bulkInsert('vendedores', [
      {
        nome: 'Vendedor 1',
        email: 'vendedor1@ebookstore.com',
        cpf: '98765432101',
        telefone: '11444444444',
        comissaoPercentual: 5.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Vendedor 2',
        email: 'vendedor2@ebookstore.com',
        cpf: '87654321012',
        telefone: '11333333333',
        comissaoPercentual: 7.50,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendedores', null, {});
  }
};
