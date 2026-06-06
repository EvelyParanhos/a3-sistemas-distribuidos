class RelatorioService {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async generate() {
    return this.strategy.execute();
  }
}

module.exports = RelatorioService;
