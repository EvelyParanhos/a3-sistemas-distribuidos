const crypto = require('crypto');
const http = require('http');
const jwt = require('jsonwebtoken');

// Valores que o middleware de auth valida (iss/aud). Definidos como env ANTES de
// o app (e o auth.js) serem carregados pelo teste.
const ISSUER = 'http://keycloak.test/realms/ebookstore';
const AUDIENCE = 'ebookstore-api';
const KID = 'test-key-1';

process.env.KEYCLOAK_ISSUER = ISSUER;
process.env.KEYCLOAK_AUDIENCE = AUDIENCE;

// Par de chaves RSA que simula o Keycloak: assina os tokens e publica a chave
// pública no endpoint JWKS mockado.
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: KID, use: 'sig', alg: 'RS256' };

let server;

// Sobe um servidor HTTP local que serve o JWKS (chave pública) e aponta
// KEYCLOAK_JWKS_URI para ele. Usar um servidor real (em vez de interceptar a lib)
// garante que toda a cadeia express-jwt + jwks-rsa é exercitada de verdade.
function startJwksServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ keys: [jwk] }));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      process.env.KEYCLOAK_JWKS_URI = `http://127.0.0.1:${port}/certs`;
      resolve();
    });
  });
}

function stopJwksServer() {
  return new Promise((resolve) => {
    if (!server) return resolve();
    server.closeAllConnections?.();
    server.close(() => resolve());
  });
}

// Gera um access token RS256 como o Keycloak emitiria. Os parâmetros permitem
// forjar cenários inválidos (issuer/audience errados, expirado).
function signToken({
  roles = [],
  issuer = ISSUER,
  audience = AUDIENCE,
  username = 'tester',
  expiresIn = '5m',
} = {}) {
  return jwt.sign(
    { realm_access: { roles }, preferred_username: username, typ: 'Bearer' },
    privatePem,
    { algorithm: 'RS256', keyid: KID, issuer, audience, subject: 'user-123', expiresIn }
  );
}

module.exports = { ISSUER, AUDIENCE, KID, startJwksServer, stopJwksServer, signToken };
