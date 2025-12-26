# Movie Database Application - Project Requirements & Documentation

## Project Overview
This is a React Native movie database application built as a senior React Native position assessment. The app allows users to browse movies, view details, and manage a personal watchlist.

## Technology Stack
- **Framework**: React Native 0.83.1 (initialized with `react-native init`)
- **Language**: TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **API**: The Movie Database (TMDB) API
- **Storage**: AsyncStorage (via Redux Persist)
- **HTTP Client**: Axios
- **UI Libraries**: 
  - react-native-svg (for custom icons)
  - react-native-vector-icons
  - react-native-safe-area-context

## Project Structure
```
src/
├── api/              # API client and movie endpoints
│   ├── client.ts     # Axios instance with interceptors
│   ├── movies.ts     # Movie API functions
│   └── types.ts      # TypeScript interfaces and enums
├── assets/           # Static assets
│   └── svgs/         # SVG icon components
├── components/       # Reusable UI components
│   ├── Icon.tsx      # Icon wrapper component
│   ├── MovieCard.tsx # Movie list item component
│   └── index.ts      # Component exports
├── navigation/       # Navigation configuration
│   └── AppNavigator.tsx
├── screens/          # Screen components
│   ├── Home/         # Home screen with movie list
│   ├── Details/      # Movie details screen
│   └── Watchlist/    # User watchlist screen
├── store/            # Redux store configuration
│   ├── store.ts      # Store setup with persistence
│   ├── hooks.ts      # Typed Redux hooks
│   └── slices/       # Redux slices
│       ├── settingsSlice.ts  # Category, sort preferences
│       └── watchlistSlice.ts # Watchlist state
├── theme/            # Theme configuration (if any)
├── types/            # Global TypeScript types
└── utils/            # Utility functions
```

## Feature Requirements

### 1. Home Screen
**Required Features:**
- Category dropdown with options:
  - Now Playing
  - Upcoming
  - Popular
- Category preference must be persisted (local storage)
- Search text field for movie keywords
- Search button to trigger API call with category + search keyword
- Movie list displaying:
  - Poster
  - Name
  - Release date
  - Overview
- Each movie item is pressable → navigates to Details screen
- Error handling: Show appropriate messages for API errors or empty data

**Optional Features:**
- "Sort by" dropdown (between Category and Search):
  - Alphabetical order
  - By rating
  - By release date
- Sort preference must be persisted
- Bottom tab navigation (required if implementing Watchlist)

### 2. Details Screen
**Required Features:**
- Display movie information:
  - Name
  - Year of release
  - Movie rating (PG13, etc.)
  - Poster
  - Release date
  - Runtime
  - Genre(s)
  - Status
  - Original Language
  - Credits (Director or Writer only)
  - Average vote (User Score)
  - Tagline
  - Overview
- Cast members section:
  - Horizontal scroll carousel
  - Display: Name and Role

**Optional Features:**
- "Add to Watchlist" button (add/remove functionality)
- "Recommended movies" section:
  - Horizontal scroll carousel
  - List of recommended movies

### 3. Watchlist Screen (Optional)
**Required Features:**
- Display list of movies in user's watchlist
- Watchlist must be persisted (local storage)
- Display username and joined date
- Back button (right chevron icon) to navigate to Home
- Each item displays:
  - Poster
  - Name
  - Release date
  - Overview
- Each item is pressable → navigates to Details screen
- Remove button ("X" on top right) for each movie item
- "Filter by" button with dropdown:
  - Alphabetical order
  - Rating
  - Release date
- Sort order toggle: Ascending (arrow-down) / Descending (arrow-up)
- Use open-source React Native library for dropdown

## API Requirements

### TMDB API Setup
- **API Documentation**: https://developer.themoviedb.org/reference/intro/getting-started
- **Authentication**: Use API Read Access Token (Bearer token)
- **Important**: Never commit API keys to GitHub repository
- **Environment Variables**: Use `.env` file with `react-native-dotenv`

### Required API Endpoints
1. **Now Playing**: `/movie/now_playing`
2. **Popular**: `/movie/popular`
3. **Upcoming**: `/movie/upcoming`
4. **Movie Details**: `/movie/{movie_id}`
5. **Movie Credits**: `/movie/{movie_id}/credits` (or via `append_to_response`)
6. **Account Details**: `/account` (for username/joined date)
7. **Search Movies**: `/search/movie`
8. **Movie Recommendations** (Optional): `/movie/{movie_id}/recommendations`

### API Client Configuration
- Base URL: `https://api.themoviedb.org/3`
- Authorization: Bearer token in headers
- Timeout: 10 seconds
- Error handling: Global interceptors for error responses

## State Management

### Redux Store Structure
```typescript
{
  settings: {
    selectedCategory: EMovieCategory,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  },
  watchlist: {
    movies: IMovie[]
  }
}
```

### Persistence
- Use Redux Persist with AsyncStorage
- Persist: `settings` and `watchlist` slices
- Persist configuration: `key: 'root'`, `whitelist: ['settings', 'watchlist']`

## UI/UX Requirements

### Design Reference
- **Figma Design**: https://www.figma.com/file/ZfiD9sNTA9IjlflyipIGmr/App-Developer-Test---UI-Design
- Login to Figma account required to view design

### UI Guidelines
- Consistent design across all screens
- User-friendly interface
- Appropriate error messages for:
  - API errors
  - Empty data states
  - Network failures
- Loading states for async operations
- Safe area handling for iOS/Android

### Navigation
- Bottom tab navigation (if Watchlist is implemented)
- Stack navigation for Home → Details flow
- Tab bar styling:
  - Active color: `#01B4E4`
  - Inactive color: `#999`
  - Background: `#032541`

## Code Quality Standards

### Assessment Criteria
1. **Feature Completeness**: Extent to which all required functionalities are implemented
2. **Code Readability**: 
   - Naming conventions
   - Comments and documentation
   - Code organization
3. **Code Reusability and Extensibility**:
   - Reusable components
   - Easy to extend for future features
4. **Consistent UI/UX**: Coherent and user-friendly interface across the app

### Code Style Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Separate business logic from UI (custom hooks)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use proper error boundaries where needed

## Development Workflow

### Git Requirements
- Use Git for version control
- Make repository public on GitHub
- Provide GitHub repository URL for review
- Do NOT commit:
  - API keys
  - `.env` files
  - `node_modules/`
  - Build artifacts

### Environment Setup
1. Install dependencies: `npm install` or `yarn install`
2. Create `.env` file:
   ```
   API_URL=https://api.themoviedb.org/3
   API_KEY=your_api_read_access_token_here
   ```
3. For iOS: `cd ios && bundle exec pod install`
4. Start Metro: `npm start` or `yarn start`
5. Run app: `npm run ios` or `npm run android`

## Assumptions & Notes

### UI/UX Assumptions
- If design details are unclear, make reasonable assumptions and document them
- Error messages should be user-friendly and actionable
- Loading indicators should be shown during API calls
- Empty states should provide helpful context

### Technical Assumptions
- API responses follow TMDB standard format
- Images use TMDB image base URL: `https://image.tmdb.org/t/p/w500`
- Date formats follow ISO 8601 or TMDB format
- Runtime is in minutes
- Ratings use TMDB's vote_average (0-10 scale)

## Implementation Status

### Completed Features
- [x] Project setup with React Native init
- [x] TypeScript configuration
- [x] Redux Toolkit + Redux Persist setup
- [x] React Navigation (Stack + Bottom Tabs)
- [x] API client with Axios
- [x] Movie API functions
- [x] Home screen structure
- [x] Category dropdown
- [x] Search functionality
- [x] Movie list display
- [x] Navigation to Details screen
- [x] Watchlist screen structure
- [x] SVG icon components

### Pending/In Progress
- [ ] Sort by functionality (optional)
- [ ] Sort preference persistence
- [ ] Details screen full implementation
- [ ] Cast members carousel
- [ ] Add to Watchlist button
- [ ] Recommended movies (optional)
- [ ] Watchlist filter/sort functionality
- [ ] Error state UI
- [ ] Empty state UI
- [ ] Loading states
- [ ] Account details API integration

## Notes for Development
- All comments and documentation should be in English
- Follow the existing code structure and patterns
- Maintain consistency with current naming conventions
- Test on both iOS and Android platforms
- Ensure proper TypeScript typing throughout

