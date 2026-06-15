// Envio de e-mail SIMULADO: não há SMTP real. As chaves (números de série das
// cópias únicas dos ebooks) são "entregues" apenas registrando no log o e-mail
// que seria enviado ao cliente. Mantém a mesma interface assíncrona de um
// provedor real, para facilitar uma troca futura por nodemailer/SES/etc.
class EmailService {
  static async enviarChaves({ para, nomeCliente, vendaId, itens }) {
    const linhas = itens
      .map((i) => `   • ${i.tituloLivro} — chave: ${i.chave}`)
      .join('\n');

    const assunto = `Suas chaves de acesso — pedido #${vendaId}`;
    const corpo = [
      `Olá, ${nomeCliente}!`,
      '',
      `Obrigado pela sua compra (pedido #${vendaId}). Seguem as chaves de acesso dos seus ebooks:`,
      '',
      linhas,
      '',
      'Cada chave corresponde a uma cópia única do título. Boa leitura!',
    ].join('\n');

    const messageId = `sim-${vendaId}-${Date.now()}`;

    console.log('======================= E-MAIL (SIMULADO) =======================');
    console.log(`Para:    ${para}`);
    console.log(`Assunto: ${assunto}`);
    console.log('-----------------------------------------------------------------');
    console.log(corpo);
    console.log(`Message-Id: ${messageId}`);
    console.log('=================================================================');

    return { messageId, para, quantidadeChaves: itens.length };
  }
}

module.exports = EmailService;
