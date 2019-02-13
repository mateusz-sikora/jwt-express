var jwt = require('jsonwebtoken');
var fs = require('fs');

var privateKey = fs.readFileSync('jwtRS256.key');
var publicKey = fs.readFileSync('jwtRS256.key.pub');

var signOptions = { algorithm: 'RS256' };

var extractToken = function(header) {
  var result = /^Bearer (.*)/.exec(header);
  if (result && result.length > 1) {
    return result[1];
  }
  return null;
}

var generateToken = function(data) {
  return jwt.sign(data, privateKey, signOptions);
}

var validateToken = function(token) {
  try {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  } catch (error) {
    console.log('Invalid token');
  }
}

var validateTokenMiddleware = function(req, res, next) {
  if (req.url === '/login') {
    next();
  } else {
    var authHeader = req.headers.authorization || '';
    var token = extractToken(authHeader);
    if (token && validateToken(token)) {
      next();
    } else {
      res.status(403).send({ message: "Access denied" });
    }
  }
}

module.exports = {
  extractToken: extractToken,
  validateToken: validateToken,
  generateToken: generateToken,
  validateTokenMiddleware: validateTokenMiddleware
}