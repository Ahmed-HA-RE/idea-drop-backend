import express from 'express';
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

//@route        GET /api/ideas
//@description  Get all the ideas
//@access       Public
//@query        _limit(optional)
router.get('/', async (req, res, next) => {
  try {
    const limit = +req.query._limit;

    const ideas = await Idea.find().sort({ createdAt: -1 }).limit(limit);
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
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      const error = new Error('Please fill in the fields');
      error.statusCode = 400;
      throw error;
    }

    const newIdea = await Idea.create({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== '')
          : Array.isArray(tags)
          ? tags
          : [],
      user: req.user.id,
    });

    res.status(201).json(newIdea);
  } catch (error) {
    next(error);
  }
});

//@route        DELETE /api/ideas/:id
//@description  Delete idea
//@access       Public
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Idea was not found 🙂');
      err.statusCode = 404;
      throw err;
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      const error = new Error('Idea not found');
      error.statusCode = 404;
      throw error;
    }

    if (idea.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete it');
      error.statusCode = 403;
      throw error;
    }

    await idea.deleteOne();

    res.status(200).json({ message: 'Idea was deleted succssfully ✅' });
  } catch (error) {
    next(error);
  }
});

//@route        PUT /api/ideas/:id
//@description  Edit idea
//@access       Public
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, summary, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      const error = new Error('Please fill in the fields');
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Idea was not found 🙂');
      err.statusCode = 404;
      throw err;
    }

    const idea = await Idea.findById(id);

    if (idea.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to edit it');
      error.statusCode = 403;
      throw error;
    }

    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t !== '')
      : [];

    const updatedIdea = await idea.save();

    res.status(201).json(updatedIdea);
  } catch (error) {
    next(error);
  }
});

export default router;
