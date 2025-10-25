
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import messageRoutes from './routes/messageRoutes';
import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();


app.use(express.json());


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));



app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

export default app;
