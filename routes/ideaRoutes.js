import express from 'express';
const router = express.Router();

//@route        GET /api/ideas
//@description  Get all the ideas
//@access       Public
router.get('/', (req, res) => {
  const ideas = [
    {
      id: 1,
      title: 'Idea 1',
      description: 'This is Idea 1',
    },
    {
      id: 2,
      title: 'Idea 2',
      description: 'This is Idea 2',
    },
    {
      id: 3,
      title: 'Idea 3',
      description: 'This is Idea 3',
    },
  ];

  res.json(ideas);
});

//@route        POST /api/ideas
//@description  Create new idea
//@access       Public
router.post('/', (req, res) => {
  const request = req.body;

  res.send(request);
});

export default router;
