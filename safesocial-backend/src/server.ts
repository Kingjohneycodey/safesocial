import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { createServer } from 'http';
import { connectDB } from './config/db';

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});