import express from 'express';
import cors from 'cors';
import './config/index.js'; // Load environment variables
import apiV1Router from './api/index.js';
import errorHandler from './middleware/error.handler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1', apiV1Router);

// Global Error Handler (should be the last middleware)
app.use(errorHandler);

export default app;
