import 'dotenv/config';
import * as functions from 'firebase-functions';
import app from './app';

// Set default environment variables for development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:19006';
}

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);

// Optional: Export individual functions for better performance
export const auth = functions.https.onRequest(app);

// Health check function
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    success: true,
    message: 'PanPal Firebase Functions are running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}); 