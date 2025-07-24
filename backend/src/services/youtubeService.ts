import { getJson } from 'serpapi';
import { YouTubeVideo } from '../types';

export class YouTubeService {
  private static apiKey: string;

  /**
   * Initialize YouTube service with SerpAPI key
   */
  private static getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.SERPAPI_KEY || '';
      if (!this.apiKey) {
        throw new Error('SERPAPI_KEY environment variable is required');
      }
    }
    return this.apiKey;
  }

  /**
   * Search for cooking videos on YouTube using SerpAPI
   */
  static async searchCookingVideos(recipeName: string, limit: number = 5): Promise<YouTubeVideo[]> {
    try {
      console.log(`🔍 [YouTubeService] Searching for cooking videos: "${recipeName}"`);
      
      const apiKey = this.getApiKey();
      
      // Search for YouTube Shorts cooking videos
      const searchQuery = `${recipeName} cooking recipe short video`;
      
      const response = await getJson('youtube', {
        search_query: searchQuery,
        api_key: apiKey,
        hl: 'en',
        gl: 'us'
      });

      console.log(`📊 [YouTubeService] Found ${response.video_results?.length || 0} videos`);

      if (!response.video_results || response.video_results.length === 0) {
        console.log('ℹ️ [YouTubeService] No videos found, trying broader search');
        return await this.fallbackSearch(recipeName, limit);
      }

      // Convert SerpAPI response to our YouTubeVideo format
      const videos = response.video_results
        .map((video: any) => this.convertToYouTubeVideo(video))
        .filter((video: YouTubeVideo) => video !== null)
        .sort((a: YouTubeVideo, b: YouTubeVideo) => (b.likes ?? 0) - (a.likes ?? 0)) // Sort by likes descending
        .slice(0, limit);

      console.log(`✅ [YouTubeService] Returning ${videos.length} videos sorted by likes`);
      return videos;

    } catch (error) {
      console.error('❌ [YouTubeService] Error searching for videos:', error);
      return await this.fallbackSearch(recipeName, limit);
    }
  }

  /**
   * Fallback search with broader terms if initial search fails
   */
  private static async fallbackSearch(recipeName: string, limit: number): Promise<YouTubeVideo[]> {
    try {
      console.log(`🔄 [YouTubeService] Trying fallback search for: "${recipeName}"`);
      
      const apiKey = this.getApiKey();
      
      // Broader search terms
      const fallbackQueries = [
        `${recipeName} recipe`,
        `${recipeName} cooking`,
        `how to cook ${recipeName}`,
        `${recipeName} tutorial`
      ];

      for (const query of fallbackQueries) {
        try {
          const response = await getJson('youtube', {
            search_query: query,
            api_key: apiKey,
            hl: 'en',
            gl: 'us'
          });

          if (response.video_results && response.video_results.length > 0) {
            const videos = response.video_results
              .map((video: any) => this.convertToYouTubeVideo(video))
              .filter((video: YouTubeVideo) => video !== null)
              .sort((a: YouTubeVideo, b: YouTubeVideo) => (b.likes ?? 0) - (a.likes ?? 0))
              .slice(0, limit);

            console.log(`✅ [YouTubeService] Fallback search successful with query: "${query}"`);
            return videos;
          }
        } catch (error) {
          console.log(`⚠️ [YouTubeService] Fallback query "${query}" failed:`, error);
          continue;
        }
      }

      console.log('ℹ️ [YouTubeService] All fallback searches failed, returning mock data');
      return this.getMockVideos(recipeName, limit);

    } catch (error) {
      console.error('❌ [YouTubeService] Fallback search error:', error);
      return this.getMockVideos(recipeName, limit);
    }
  }

  /**
   * Convert SerpAPI video result to our YouTubeVideo format
   */
  private static convertToYouTubeVideo(videoData: any): YouTubeVideo | null {
    try {
      if (!videoData.title || !videoData.link) {
        return null;
      }

      // Extract video ID from URL
      const videoId = this.extractVideoId(videoData.link);
      if (!videoId) {
        return null;
      }

      // Parse likes count
      let likes = 0;
      if (videoData.extra && videoData.extra.likes) {
        likes = this.parseLikeCount(videoData.extra.likes);
      }

      return {
        id: videoId,
        title: videoData.title,
        description: videoData.description || '',
        thumbnail: videoData.thumbnail || '',
        channel: videoData.channel || 'Unknown Channel',
        duration: videoData.duration || '',
        views: videoData.views || '0',
        likes: likes,
        publishedAt: videoData.published || '',
        videoUrl: videoData.link,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
      };
    } catch (error) {
      console.error('❌ [YouTubeService] Error converting video data:', error);
      return null;
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  private static extractVideoId(url: string): string | null {
    try {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('❌ [YouTubeService] Error extracting video ID:', error);
      return null;
    }
  }

  /**
   * Parse like count from string format (e.g., "1.2K", "500", "1.5M")
   */
  private static parseLikeCount(likesStr: string): number {
    try {
      const cleanStr = likesStr.replace(/[^\d.KMB]/g, '').toUpperCase();
      
      if (cleanStr.includes('K')) {
        return Math.round(parseFloat(cleanStr.replace('K', '')) * 1000);
      } else if (cleanStr.includes('M')) {
        return Math.round(parseFloat(cleanStr.replace('M', '')) * 1000000);
      } else if (cleanStr.includes('B')) {
        return Math.round(parseFloat(cleanStr.replace('B', '')) * 1000000000);
      } else {
        return parseInt(cleanStr) || 0;
      }
    } catch (error) {
      console.error('❌ [YouTubeService] Error parsing like count:', error);
      return 0;
    }
  }

  /**
   * Get mock videos for fallback when API fails
   */
  private static getMockVideos(recipeName: string, limit: number): YouTubeVideo[] {
    console.log(`🎭 [YouTubeService] Generating mock videos for: "${recipeName}"`);
    
    const mockVideos: YouTubeVideo[] = [];
    const mockChannels = [
      'Cooking Masterclass',
      'Chef\'s Kitchen',
      'Quick Recipes',
      'Home Cooking',
      'Culinary Delights'
    ];

    for (let i = 0; i < Math.min(limit, 3); i++) {
      mockVideos.push({
        id: `mock-video-${i + 1}`,
        title: `How to Make ${recipeName} - Easy Recipe Tutorial`,
        description: `Learn how to cook delicious ${recipeName} with this step-by-step tutorial. Perfect for beginners and experienced cooks alike.`,
        thumbnail: `https://via.placeholder.com/320x180/FF6B6B/FFFFFF?text=${encodeURIComponent(recipeName)}`,
        channel: mockChannels[i % mockChannels.length],
        duration: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 100) + 10}K`,
        likes: Math.floor(Math.random() * 1000) + 100,
        publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        videoUrl: `https://www.youtube.com/watch?v=mock-video-${i + 1}`,
        embedUrl: `https://www.youtube.com/embed/mock-video-${i + 1}`
      });
    }

    return mockVideos.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  }

  /**
   * Get the best cooking video for a recipe (highest likes)
   */
  static async getBestCookingVideo(recipeName: string): Promise<YouTubeVideo | null> {
    try {
      console.log(`🏆 [YouTubeService] Finding best cooking video for: "${recipeName}"`);
      
      const videos = await this.searchCookingVideos(recipeName, 1);
      
      if (videos.length > 0) {
        console.log(`✅ [YouTubeService] Best video found: "${videos[0].title}" with ${videos[0].likes} likes`);
        return videos[0];
      } else {
        console.log('ℹ️ [YouTubeService] No videos found');
        return null;
      }
    } catch (error) {
      console.error('❌ [YouTubeService] Error getting best video:', error);
      return null;
    }
  }
} 