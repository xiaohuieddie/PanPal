# PanPal Frontend

React Native app for PanPal - AI健康饮食助手

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── onboarding/    # Welcome, health setup, preferences
│   │   └── main/          # Home, meal plan, check-in, profile
│   ├── stores/            # State management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, icons, fonts
├── App.tsx               # Main app component
└── package.json          # Dependencies and scripts
```

## Features Implemented

### ✅ Onboarding Flow
- **Welcome Screen**: App introduction with feature highlights
- **Health Setup**: User basic info (gender, age, height, weight, goals)
- **Preferences Setup**: Cuisine preferences, cooking time, budget

### ✅ Main App Screens
- **Home Screen**: Daily overview, progress tracking, quick actions
- **Meal Plan Screen**: Weekly meal planning with nutrition info
- **Check-in Screen**: Daily meal check-ins, streak tracking, rewards
- **Profile Screen**: User profile, achievements, settings menu

### ✅ Navigation
- Stack navigation for onboarding flow
- Bottom tab navigation for main app
- Smooth transitions between screens

### ✅ UI/UX Design
- Chinese language support (中文界面)
- Modern, clean design with green theme (#4CAF50)
- Gradient backgrounds and card-based layouts
- Icons and emojis for visual appeal
- Responsive design for different screen sizes

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Run on devices**:
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   npm run web     # Web browser
   ```

## Dependencies

### Core
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and toolchain
- **TypeScript**: Type safety and better development experience

### Navigation
- **@react-navigation/native**: Navigation library
- **@react-navigation/native-stack**: Stack navigator
- **@react-navigation/bottom-tabs**: Tab navigator

### UI Components
- **expo-linear-gradient**: Gradient backgrounds
- **@expo/vector-icons**: Icon library
- **react-native-screens**: Native screen components
- **react-native-safe-area-context**: Safe area handling

## Next Steps

### Backend Integration
- [ ] API endpoints for user registration and profile
- [ ] Meal plan generation API
- [ ] Check-in and progress tracking API
- [ ] Reward system API

### Additional Features
- [ ] Camera integration for meal photos
- [ ] Push notifications for meal reminders
- [ ] Social features (sharing, community)
- [ ] Shopping list integration with external platforms
- [ ] Offline support and data caching

### Performance & Polish
- [ ] Image optimization and lazy loading
- [ ] Error handling and loading states
- [ ] Accessibility improvements
- [ ] Testing (unit and integration tests)
- [ ] App store preparation and deployment

## Development Notes

The app is currently in MVP state with mock data. All screens are functional with placeholder content that matches the PRD requirements. The foundation is solid for adding real API integration and advanced features.

Key architectural decisions:
- TypeScript for type safety
- Modular screen organization
- Centralized navigation structure
- Consistent UI/UX patterns
- Scalable folder structure for future growth