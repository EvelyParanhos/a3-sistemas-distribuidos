const { expressjwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const issuer = process.env.KEYCLOAK_ISSUER;
const audience = process.env.KEYCLOAK_AUDIENCE;
const jwksUri =
  process.env.KEYCLOAK_JWKS_URI ||
  (issuer ? `${issuer}/protocol/openid-connect/certs` : undefined);

if (!issuer || !jwksUri) {
  throw new Error(
    'Configuração do Keycloak ausente: defina KEYCLOAK_ISSUER (e opcionalmente KEYCLOAK_JWKS_URI).'
  );
}

// Valida o Bearer JWT emitido pelo Keycloak: assinatura (chave pública via JWKS),
// emissor (iss), audiência (aud) e expiração. O payload decodificado fica em req.auth.
const authenticate = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri,
  }),
  algorithms: ['RS256'],
  issuer,
  ...(audience ? { audience } : {}),
  requestProperty: 'auth',
});

// Exige que o token possua ao menos uma das roles de realm informadas.
const authorize = (...rolesPermitidas) => (req, res, next) => {
  const roles = (req.auth && req.auth.realm_access && req.auth.realm_access.roles) || [];
  const autorizado = rolesPermitidas.some((role) => roles.includes(role));

  if (!autorizado) {
    const err = new Error(
      `Acesso negado: requer uma das roles [${rolesPermitidas.join(', ')}].`
    );
    err.statusCode = 403;
    return next(err);
  }

  next();
};

module.exports = { authenticate, authorize };
