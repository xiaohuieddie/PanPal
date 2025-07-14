import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : [
        'http://localhost:3000', 
        'http://localhost:19006',
        'http://localhost:8081',
        'http://localhost:19000',
        'exp://localhost:19000',
        'exp://192.168.68.106:8081'
      ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PanPal API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/ai', aiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app; 