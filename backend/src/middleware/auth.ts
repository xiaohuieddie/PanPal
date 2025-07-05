import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    wechatId?: string;
    displayName?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const result = await AuthService.verifyToken(token);
    if (!result.success || !result.data) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = result.data;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const result = await AuthService.verifyToken(token);
      if (result.success && result.data) {
        req.user = result.data;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}; 