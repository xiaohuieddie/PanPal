import { Router, Response } from 'express';
import { AIService } from '../services/aiService';
import { YouTubeService } from '../services/youtubeService';
import { generateMealPlanSchema } from '../validation/schemas';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /ai/generate-meal-plan
 * Generate personalized weekly meal plan
 */
router.post('/generate-meal-plan', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = generateMealPlanSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      });
      return;
    }

    // Add user ID from authentication
    const userProfile = {
      ...value,
      id: req.user!.uid
    };

    // Generate meal plan
    const mealPlan = await AIService.generateWeeklyMealPlan(userProfile);
    
    res.status(200).json({
      success: true,
      data: mealPlan,
      message: 'Meal plan generated successfully'
    });
  } catch (error: any) {
    console.error('Generate meal plan route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate meal plan'
    });
  }
});

/**
 * GET /ai/meal-plan/:week
 * Get meal plan for specific week
 */
router.get('/meal-plan/:week', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { week } = req.params;
    const userId = req.user!.uid;

    // Get meal plan from database
    const mealPlan = await AIService.getMealPlan(userId, week);
    
    if (mealPlan) {
      res.status(200).json({
        success: true,
        data: mealPlan
      });
    } else {
      // Return 200 with empty meal plan structure instead of 404
      res.status(200).json({
        success: true,
        data: {
          id: null,
          userId: userId,
          week: week,
          meals: [],
          createdAt: null
        }
      });
    }
  } catch (error: any) {
    console.error('Get meal plan route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve meal plan'
    });
  }
});

/**
 * POST /ai/regenerate-day
 * Regenerate meals for a specific day
 */
router.post('/regenerate-day', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { week, date, mealType } = req.body;
    const userId = req.user!.uid;
    
    if (!week || !date || !mealType) {
      res.status(400).json({
        success: false,
        error: 'Week, date, and meal type are required'
      });
      return;
    }

    // Regenerate specific day meals
    const updatedMealPlan = await AIService.regenerateDayMeals(
      userId,
      week,
      date,
      mealType
    );
    
    res.status(200).json({
      success: true,
      data: updatedMealPlan,
      message: 'Day meals regenerated successfully'
    });
  } catch (error: any) {
    console.error('Regenerate day route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate day meals'
    });
  }
});

/**
 * GET /ai/recipe-suggestions
 * Get recipe suggestions based on user preferences
 */
router.get('/recipe-suggestions', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { mealType, limit = 10 } = req.query;
    const userId = req.user!.uid;
    
    // Get recipe suggestions
    const suggestions = await AIService.getRecipeSuggestions(
      userId,
      mealType as string,
      parseInt(limit as string)
    );
    
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error: any) {
    console.error('Recipe suggestions route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recipe suggestions'
    });
  }
});

/**
 * GET /ai/cooking-videos
 * Search for cooking videos on YouTube
 */
router.get('/cooking-videos', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { recipeName, limit = 5 } = req.query;
    
    if (!recipeName) {
      res.status(400).json({
        success: false,
        error: 'Recipe name is required'
      });
      return;
    }

    console.log(`🎥 [API] Searching for cooking videos: "${recipeName}"`);
    
    // Search for cooking videos
    const videos = await YouTubeService.searchCookingVideos(
      recipeName as string,
      parseInt(limit as string)
    );
    
    res.status(200).json({
      success: true,
      data: videos,
      message: `Found ${videos.length} cooking videos for "${recipeName}"`
    });
  } catch (error: any) {
    console.error('Cooking videos route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search for cooking videos'
    });
  }
});

/**
 * GET /ai/best-cooking-video
 * Get the best cooking video for a recipe (highest likes)
 */
router.get('/best-cooking-video', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { recipeName } = req.query;
    
    if (!recipeName) {
      res.status(400).json({
        success: false,
        error: 'Recipe name is required'
      });
      return;
    }

    console.log(`🏆 [API] Finding best cooking video for: "${recipeName}"`);
    
    // Get the best cooking video
    const video = await YouTubeService.getBestCookingVideo(recipeName as string);
    
    if (video) {
      res.status(200).json({
        success: true,
        data: video,
        message: `Found best cooking video for "${recipeName}"`
      });
    } else {
      res.status(404).json({
        success: false,
        error: `No cooking videos found for "${recipeName}"`
      });
    }
  } catch (error: any) {
    console.error('Best cooking video route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find best cooking video'
    });
  }
});

export default router; 