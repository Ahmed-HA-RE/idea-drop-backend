import express from 'express';
import User from '../models/User.js';

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

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
