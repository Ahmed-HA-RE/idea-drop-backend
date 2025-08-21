import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/database.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// Connect MongoDB with mongoose
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/ideas', ideaRoutes);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalURL}`);
  error.statusCode = 400;

  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
