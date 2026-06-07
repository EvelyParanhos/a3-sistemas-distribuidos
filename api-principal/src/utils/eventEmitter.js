const EventEmitter = require('events');

class AsyncEventEmitter extends EventEmitter {
  // emit() não espera listeners assíncronos terminarem. Quando o payload carrega
  // uma transaction que será commitada logo em seguida, isso causa uma corrida:
  // o listener tenta usar a transaction depois do commit e derruba o processo
  // com uma unhandled rejection. emitAsync aguarda cada listener (em ordem) e
  // propaga eventuais erros para quem disparou o evento.
  async emitAsync(event, payload) {
    for (const listener of this.listeners(event)) {
      await listener(payload);
    }
  }
}

const eventEmitter = new AsyncEventEmitter();

module.exports = eventEmitter;
