import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');

export function authenticate(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth middleware reached!');
  }

  const authHeader = req.headers.authorization;

  if (process.env.NODE_ENV === 'development') {
    console.log('Header found:', authHeader);
  }

  const err = new Error('Not authenticated. Please provide a valid token.');
  err.status = 401;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (process.env.NODE_ENV === 'development') {
      console.log('Decoded JWT Payload:', payload);
    }

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    return next(err);
  }
}
