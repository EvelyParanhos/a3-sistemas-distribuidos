const eventEmitter = require('../utils/eventEmitter');
const Produto = require('../models/Produto');
const Propriedade = require('../models/Propriedade');
const { v4: uuidv4 } = require('uuid');

const licenciamentoListener = () => {
  // Ao confirmar a venda, geramos as cópias únicas (licenças) para o cliente
  eventEmitter.on('venda.confirmada', async ({ itens, transaction, clienteId, vendaId }) => {
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId, { transaction });

      if (!produto || !produto.emCatalogo) {
        throw new Error(`O ebook "${produto ? produto.titulo : item.produtoId}" não está mais disponível para venda.`);
      }

      // Criar a propriedade única para o cliente (Direito de posse do Ebook)
      // Se o cliente comprou 2 cópias, ele terá 2 registros com números de série diferentes
      for (let i = 0; i < item.quantidade; i++) {
        await Propriedade.create({
          clienteId,
          produtoId: item.produtoId,
          vendaId,
          numeroSerie: uuidv4(),
          dataAquisicao: new Date()
        }, { transaction });
      }

      console.log(`[Licenciamento] Cópias únicas geradas para o produto ID ${item.produtoId}`);
    }
  });

  // Ao cancelar a venda, revogamos as cópias únicas
  eventEmitter.on('venda.cancelada', async ({ vendaId, transaction }) => {
    await Propriedade.destroy({
      where: { vendaId },
      transaction
    });
    console.log(`[Licenciamento] Cópias da venda ${vendaId} revogadas.`);
  });
};

module.exports = licenciamentoListener;
