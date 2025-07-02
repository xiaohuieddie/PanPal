export const theme = {
  colors: {
    primary: '#FF6B6B', // Coral red
    primaryLight: '#FFE5E5', // Light coral background
    secondary: '#FF8A80', // Light coral
    accent: '#FFA726', // Orange accent
    background: '#FFF5F5', // Very light pink background
    surface: '#FFFFFF', // White surface
    text: {
      primary: '#2D2D2D', // Dark text
      secondary: '#6B6B6B', // Medium gray
      light: '#9E9E9E', // Light gray
      white: '#FFFFFF', // White text
    },
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    error: '#F44336', // Red
    info: '#2196F3', // Blue
  },
  gradients: {
    primary: ['#FF6B6B', '#FF8A80'], // Coral gradient
    secondary: ['#FFA726', '#FFB74D'], // Orange gradient
    background: ['#FFF5F5', '#FFE5E5'], // Light pink gradient
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    round: 50,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};