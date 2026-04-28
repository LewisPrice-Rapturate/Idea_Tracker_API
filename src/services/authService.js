import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../repositories/userRepo.js';

export async function signUp(username, password) {
  if (process.env.NODE_ENV === 'development') {
    console.log('authService.signUp() called for username:', username);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, password: hashedPassword });
  return newUser;
}

export async function logIn(username, password) {
  if (process.env.NODE_ENV === 'development') {
    console.log('authService.logIn() called for username:', username);
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const user = await findUserByUsername(username);

  const error = new Error('Invalid credentials');
  error.status = 401;
  if (!user) throw error;

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw error;

  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return accessToken;
}
