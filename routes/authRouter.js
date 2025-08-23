import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

//@route            POST /api/auth/register
//@description      Register new user
//@access           Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
      const err = new Error('All Fields Are Required');
      err.statusCode = 400;
      throw err;
    }

    const existingName = await User.findOne({ email });

    if (existingName) {
      const err = new Error('User already exists!');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.create({ name, email, password });

    const playload = { userId: user._id.toString() };
    const accessToken = await generateToken(playload, '1m');
    const refreshToken = await generateToken(playload, '30d');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.status(201).json({
      accessToken,
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

//@route            POST /api/auth/login
//@description      Authenticate user
//@access           Public

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const err = new Error('Invalid Credentials');
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const err = new Error('Invalid Credentials');
      err.statusCode = 400;
      throw err;
    }

    const playload = { userId: user._id.toString() };
    const accessToken = await generateToken(playload, '1m');
    const refreshToken = await generateToken(playload, '30d');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.status(201).json({
      accessToken,
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

//@route            POST /api/auth/logout
//@description      logout user and clear token
//@access           Private
router.post('/logout', async (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).json('logged out succssfuly');
});

export default router;
