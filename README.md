# Movie Database Application

A React Native movie database application built with TypeScript, Redux Toolkit, and React Navigation.

## Quick Start

1. Install dependencies: `npm install` or `yarn install`
2. Create `.env` file in root:
   ```
   API_URL=your_api_base_url
   API_KEY=your_api_read_access_token
   IMAGE_BASE_URL=your_api_image_url
   ```
3. iOS: `cd ios && bundle exec pod install`
4. Start Metro: `npm start`
5. Run: `npm run ios` or `npm run android`

## Key Files Reference

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (NOT committed)
- `.cursorrules` - Cursor AI assistant rules
- `PROJECT_REQUIREMENTS.md` - Full project requirements

### Core Application
- `App.tsx` - Root component with Redux Provider
- `src/navigation/AppNavigator.tsx` - Navigation setup
- `src/store/store.ts` - Redux store configuration

### API Layer
- `src/api/client.ts` - Axios instance with interceptors
- `src/api/movies.ts` - Movie API functions
- `src/api/types.ts` - TypeScript interfaces and enums

### Screens
- `src/screens/Home/` - Home screen with movie list
- `src/screens/Details/` - Movie details screen
- `src/screens/Watchlist/` - User watchlist screen

### State Management
- `src/store/slices/settingsSlice.ts` - Category, sort preferences
- `src/store/slices/watchlistSlice.ts` - Watchlist state
- `src/store/hooks.ts` - Typed Redux hooks

## Common Tasks

### Adding a New API Endpoint
1. Add function to `src/api/movies.ts`
2. Add TypeScript interface to `src/api/types.ts`
3. Use in component or custom hook

### Adding a New Screen
1. Create folder in `src/screens/[ScreenName]/`
2. Create `index.tsx` and `use[ScreenName]Logic.ts`
3. Add route to `AppNavigator.tsx`

### Adding a New Redux Slice
1. Create slice in `src/store/slices/`
2. Add to `rootReducer` in `store.ts`
3. Add to `whitelist` in `persistConfig` if needs persistence

### Adding a New Component
1. Create in `src/components/`
2. Export from `src/components/index.ts`
3. Use TypeScript props interface

## API Endpoints Used
- `GET /movie/now_playing` - Now playing movies
- `GET /movie/popular` - Popular movies
- `GET /movie/upcoming` - Upcoming movies
- `GET /movie/{id}` - Movie details
- `GET /search/movie` - Search movies
- `GET /movie/{id}/recommendations` - Recommended movies (optional)

## Color Palette
- Primary: `#01B4E4`
- Tab Bar Background: `#032541`
- Tab Active: `#01B4E4`
- Tab Inactive: `#999`

## Image URLs Pattern
- Poster: `{image_base_url}/t/p/w500{poster_path}`
- Backdrop: `{image_base_url}/t/p/w1280{backdrop_path}`
- Profile: `{image_base_url}/t/p/w185{profile_path}`

## Important Reminders
- ✅ Never commit `.env` file or API keys
- ✅ All comments/documentation in English
- ✅ Use TypeScript for all new code
- ✅ Follow existing code patterns
- ✅ Handle error and loading states
- ✅ Test on both iOS and Android
- ✅ Persist settings and watchlist

## Current Implementation Status
See `PROJECT_REQUIREMENTS.md` for detailed status of completed and pending features.

## Technology Stack
- React Native 0.83.1
- TypeScript
- Redux Toolkit with Redux Persist
- React Navigation (Native Stack + Bottom Tabs)
- Axios for API calls
- AsyncStorage for persistence
- react-native-svg for custom icons

## Project Structure
```
src/
├── api/              # API client and movie endpoints
├── assets/           # Static assets
├── components/       # Reusable UI components
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── store/            # Redux store configuration
├── theme/            # Theme configuration
├── types/            # Global TypeScript types
└── utils/            # Utility functions
```
