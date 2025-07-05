import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

export class FirebaseService {
  /**
   * Check if email already exists
   */
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error: any) {
      console.error('Check email error:', error);
      return false;
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(
    email: string, 
    password: string, 
    userData: Omit<UserProfile, 'id' | 'email' | 'createdAt' | 'updatedAt'>
  ): Promise<{ user: UserProfile; token: string }> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore - filter out undefined values
      const userProfileData: any = {
        id: user.uid,
        email: user.email || undefined,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        goal: userData.goal,
        cuisinePreferences: userData.cuisinePreferences,
        allergies: userData.allergies,
        dislikes: userData.dislikes,
        cookingTime: userData.cookingTime,
        budget: userData.budget,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Only add bodyFat if it's defined
      if (userData.bodyFat !== undefined) {
        userProfileData.bodyFat = userData.bodyFat;
      }

      // Only add wechatId if it's defined
      if (userData.wechatId !== undefined) {
        userProfileData.wechatId = userData.wechatId;
      }

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userProfileData);

      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: userData.name
      });

      // Get ID token
      const token = await user.getIdToken();

      return { user: userProfileData as UserProfile, token };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userProfile = userDoc.data() as UserProfile;
      const token = await user.getIdToken();

      return { user: userProfile, token };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        return null;
      }

      return userDoc.data() as UserProfile;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Filter out undefined values
      const filteredUpdates: any = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          filteredUpdates[key] = value;
        }
      });

      const updateData = {
        ...filteredUpdates,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);

      // Get updated profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.data() as UserProfile;
    } catch (error: any) {
      console.error('Update user profile error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get current Firebase user
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
} 