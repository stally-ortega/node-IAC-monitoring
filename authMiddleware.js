const jwt = require('jsonwebtoken');
const fs = require('fs');

const algo = process.env.JWT_ALGO || 'HS256';
const secretOrPublicKey = algo === 'RS256'
  ? fs.readFileSync('./keys/public.key')
  : process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, secretOrPublicKey, { algorithms: [algo] });
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authMiddleware;