import { auth, db } from '../config/firebase';
import { SignUpRequest, SignInRequest, UserProfile, AuthUser, ApiResponse } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  /**
   * Sign up a new user with email/password or WeChat
   */
  static async signUp(userData: SignUpRequest): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    try {
      let uid: string;
      let email: string | undefined;
      let wechatId: string | undefined;

      // Handle email/password signup
      if (userData.email && userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
        });
        uid = userRecord.uid;
        email = userData.email;
      }
      // Handle WeChat signup
      else if (userData.wechatId && userData.wechatToken) {
        // Verify WeChat token (you'll need to implement WeChat API integration)
        const wechatUser = await this.verifyWeChatToken(userData.wechatToken);
        if (!wechatUser) {
          return {
            success: false,
            error: 'Invalid WeChat token'
          };
        }

        // Create custom token for WeChat user
        const customToken = await auth.createCustomToken(wechatUser.openid);
        uid = wechatUser.openid;
        wechatId = wechatUser.openid;
      } else {
        return {
          success: false,
          error: 'Invalid signup data'
        };
      }

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: uid,
        email,
        wechatId,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        bodyFat: userData.bodyFat,
        goal: userData.goal,
        cuisinePreferences: userData.cuisinePreferences,
        allergies: userData.allergies || [],
        dislikes: userData.dislikes || [],
        cookingTime: userData.cookingTime,
        budget: userData.budget,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').doc(uid).set(userProfile);

      // Generate JWT token
      const token = jwt.sign({ uid, email, wechatId }, JWT_SECRET, { expiresIn: '7d' });

      return {
        success: true,
        data: {
          user: userProfile,
          token
        }
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message || 'Sign up failed'
      };
    }
  }

  /**
   * Sign in user with email/password or WeChat
   */
  static async signIn(credentials: SignInRequest): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    try {
      let uid: string;
      let userProfile: UserProfile;

      // Handle email/password signin
      if (credentials.email && credentials.password) {
        // Note: Firebase Auth handles email/password verification
        // For this example, we'll use a custom approach
        const userDoc = await db.collection('users')
          .where('email', '==', credentials.email)
          .limit(1)
          .get();

        if (userDoc.empty) {
          return {
            success: false,
            error: 'User not found'
          };
        }

        userProfile = userDoc.docs[0].data() as UserProfile;
        uid = userProfile.id;

        // In a real implementation, you'd verify the password here
        // For now, we'll assume the user exists
      }
      // Handle WeChat signin
      else if (credentials.wechatId && credentials.wechatToken) {
        const wechatUser = await this.verifyWeChatToken(credentials.wechatToken);
        if (!wechatUser || wechatUser.openid !== credentials.wechatId) {
          return {
            success: false,
            error: 'Invalid WeChat credentials'
          };
        }

        const userDoc = await db.collection('users').doc(credentials.wechatId).get();
        if (!userDoc.exists) {
          return {
            success: false,
            error: 'User not found'
          };
        }

        userProfile = userDoc.data() as UserProfile;
        uid = userProfile.id;
      } else {
        return {
          success: false,
          error: 'Invalid signin data'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { uid, email: userProfile.email, wechatId: userProfile.wechatId },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        data: {
          user: userProfile,
          token
        }
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message || 'Sign in failed'
      };
    }
  }

  /**
   * Verify JWT token and get user
   */
  static async verifyToken(token: string): Promise<ApiResponse<AuthUser>> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const userDoc = await db.collection('users').doc(decoded.uid).get();
      if (!userDoc.exists) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userData = userDoc.data() as UserProfile;
      const authUser: AuthUser = {
        uid: userData.id,
        email: userData.email,
        wechatId: userData.wechatId,
        displayName: userData.name,
      };

      return {
        success: true,
        data: authUser
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Invalid token'
      };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(uid: string): Promise<ApiResponse<UserProfile>> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userProfile = userDoc.data() as UserProfile;
      return {
        success: true,
        data: userProfile
      };
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user profile'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await db.collection('users').doc(uid).update(updateData);

      // Get updated profile
      const userDoc = await db.collection('users').doc(uid).get();
      const userProfile = userDoc.data() as UserProfile;

      return {
        success: true,
        data: userProfile
      };
    } catch (error: any) {
      console.error('Update user profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update user profile'
      };
    }
  }

  /**
   * Verify WeChat token (placeholder - implement actual WeChat API integration)
   */
  private static async verifyWeChatToken(token: string): Promise<any> {
    // This is a placeholder implementation
    // In a real app, you would:
    // 1. Call WeChat API to verify the token
    // 2. Get user information from WeChat
    // 3. Return the verified user data
    
    // For now, we'll return a mock response
    return {
      openid: 'mock_wechat_openid',
      nickname: 'Mock User',
      sex: 1,
      province: 'Beijing',
      city: 'Beijing',
      country: 'China',
      headimgurl: 'https://example.com/avatar.jpg',
      privilege: [],
    };
  }
} 