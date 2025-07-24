import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { YouTubeVideo } from '../types/recipe';
import { theme } from '../utils/theme';

interface CookingVideoProps {
  video: YouTubeVideo | null;
  recipeName: string;
  onVideoLoad?: () => void;
  onVideoError?: (error: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CookingVideo({ 
  video, 
  recipeName, 
  onVideoLoad, 
  onVideoError 
}: CookingVideoProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVideoPress = () => {
    if (video && video.embedUrl) {
      setShowVideo(true);
      setLoading(true);
    } else {
      console.warn('Video or embed URL is missing');
    }
  };

  const handleVideoLoad = () => {
    setLoading(false);
    onVideoLoad?.();
  };

  const handleVideoError = () => {
    setLoading(false);
    onVideoError?.('Failed to load video');
  };

  const formatLikes = (likes: number | undefined): string => {
    if (!likes || isNaN(likes)) return '0';
    
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`;
    } else if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };

  const formatViews = (views: string | undefined): string => {
    if (!views) return '0 views';
    
    const numViews = parseInt(views.replace(/[^\d]/g, ''));
    if (isNaN(numViews)) return '0 views';
    
    if (numViews >= 1000000) {
      return `${(numViews / 1000000).toFixed(1)}M views`;
    } else if (numViews >= 1000) {
      return `${(numViews / 1000).toFixed(1)}K views`;
    }
    return `${numViews} views`;
  };

  if (!video) {
    return (
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="play-circle" size={80} color="#ccc" />
          <Text style={styles.videoPlaceholderText}>
            {recipeName} Cooking Video
          </Text>
          <Text style={styles.videoPlaceholderSubtext}>
            How to cook {recipeName} tutorial
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.videoContainer}>
      {/* Video Thumbnail */}
      <TouchableOpacity style={styles.thumbnailContainer} onPress={handleVideoPress}>
        <Image 
          source={{ uri: video.thumbnail || 'https://via.placeholder.com/320x180/ccc/666?text=No+Thumbnail' }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playButton}>
          <Ionicons name="play" size={24} color="white" />
        </View>
        {video.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title || 'Untitled Video'}
        </Text>
        <Text style={styles.channelName}>{video.channel || 'Unknown Channel'}</Text>
        <View style={styles.videoStats}>
          <Text style={styles.statsText}>{formatViews(video.views)}</Text>
          <Text style={styles.statsText}>•</Text>
          <Text style={styles.statsText}>{formatLikes(video.likes)} likes</Text>
        </View>
      </View>

      {/* Video Modal */}
      <Modal
        visible={showVideo}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowVideo(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowVideo(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {video.title || 'Untitled Video'}
            </Text>
          </View>

          {/* Video Player */}
          <View style={styles.videoPlayer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading video...</Text>
              </View>
            )}
            <WebView
              source={{ uri: video.embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ' }}
              style={styles.webview}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>

          {/* Video Details */}
          <View style={styles.videoDetails}>
            <Text style={styles.modalVideoTitle}>{video.title || 'Untitled Video'}</Text>
            <Text style={styles.modalChannelName}>{video.channel || 'Unknown Channel'}</Text>
            <View style={styles.modalStats}>
              <Text style={styles.modalStatsText}>{formatViews(video.views)}</Text>
              <Text style={styles.modalStatsText}>•</Text>
              <Text style={styles.modalStatsText}>{formatLikes(video.likes)} likes</Text>
            </View>
            <Text style={styles.videoDescription} numberOfLines={3}>
              {video.description || 'No description available'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
    height: 200,
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  videoPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'black',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  videoPlayer: {
    width: screenWidth,
    height: screenWidth * 9 / 16, // 16:9 aspect ratio
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 8,
  },
  videoDetails: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  modalVideoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalChannelName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  modalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalStatsText: {
    fontSize: 14,
    color: '#999',
    marginRight: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 