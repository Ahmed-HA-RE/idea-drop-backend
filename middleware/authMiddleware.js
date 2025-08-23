import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
import { JWT_SECRET } from '../utils/getJwtSecret.js';

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not Authorized, no token');
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await User.findById({ _id: payload.userId }).select(
      '_id name email'
    );

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    req.user = user;
    next();
  } catch (error) {
    next(new Error('Not Authorized, no token'));
  }
}
