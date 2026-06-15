const eventEmitter = require('../utils/eventEmitter');
const Propriedade = require('../models/Propriedade');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');
const EmailService = require('../services/EmailService');

const emailListener = () => {
  // Após a venda ser confirmada e persistida (pós-commit), entregamos as chaves
  // (números de série) por e-mail ao cliente. Roda fora da transação: uma falha
  // de envio não desfaz a venda — apenas é registrada no log.
  eventEmitter.on('venda.entregue', async ({ vendaId }) => {
    try {
      const propriedades = await Propriedade.findAll({
        where: { vendaId },
        include: [Cliente, Produto],
      });

      if (propriedades.length === 0) return;

      const cliente = propriedades[0].Cliente;
      const itens = propriedades.map((p) => ({
        tituloLivro: p.Produto.titulo,
        chave: p.numeroSerie,
      }));

      await EmailService.enviarChaves({
        para: cliente.email,
        nomeCliente: cliente.nome,
        vendaId,
        itens,
      });
    } catch (err) {
      console.error(`[Email] Falha ao enviar chaves da venda ${vendaId}: ${err.message}`);
    }
  });
};

module.exports = emailListener;
