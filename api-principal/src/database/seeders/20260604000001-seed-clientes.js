'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clientes', null, {});
    await queryInterface.bulkInsert('clientes', [
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '12345678901',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Maria Souza',
        email: 'maria@email.com',
        cpf: '23456789012',
        telefone: '11888888888',
        endereco: 'Rua B, 456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Pedro Santos',
        email: 'pedro@email.com',
        cpf: '34567890123',
        telefone: '11777777777',
        endereco: 'Rua C, 789',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Ana Oliveira',
        email: 'ana@email.com',
        cpf: '45678901234',
        telefone: '11666666666',
        endereco: 'Rua D, 101',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Lucas Lima',
        email: 'lucas@email.com',
        cpf: '56789012345',
        telefone: '11555555555',
        endereco: 'Rua E, 202',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clientes', null, {});
  }
};
