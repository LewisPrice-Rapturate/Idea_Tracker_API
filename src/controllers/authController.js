import { signUp, logIn } from '../services/authService.js';

export async function signUpHandler(req, res) {
  const { username, password } = req.body;
  const newUser = await signUp(username, password);
  res.status(201).json(newUser);
}

export async function logInHandler(req, res) {
  const { username, password } = req.body;
  const accessToken = await logIn(username, password);
  res.status(200).json({ accessToken });
}
