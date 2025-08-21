import express from 'express';
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';
const router = express.Router();

//@route        GET /api/ideas
//@description  Get all the ideas
//@access       Public
router.get('/', async (req, res, next) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (error) {
    next(error);
  }
});

//@route        GET /api/ideas/:id
//@description  Get single idea
//@access       Public
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Idea Not Found');
  }

  try {
    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    res.json(idea);
  } catch (error) {
    next(error);
  }
});

//@route        POST /api/ideas
//@description  Create new idea
//@access       Public
router.post('/', (req, res) => {
  const request = req.body;

  res.send(request);
});

export default router;
