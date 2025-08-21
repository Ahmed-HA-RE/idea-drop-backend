import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/ideas', ideaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
