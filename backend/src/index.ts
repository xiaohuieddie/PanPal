import * as functions from 'firebase-functions';
import app from './app';

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