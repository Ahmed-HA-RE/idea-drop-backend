import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes.js';
import authRouter from './routes/authRouter.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// Connect MongoDB with mongoose
connectDB();

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/ideas', ideaRoutes);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
