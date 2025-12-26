# Installation Notes

## Required Dependencies

The following dependencies are already included in `package.json`:

- `react-native-collapsible` - For accordion expand/collapse animation
- `react-native-reanimated` - For smooth animations (chevron rotation)
- `react-native-worklets` - Required dependency for react-native-reanimated

If you need to reinstall:

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

## iOS Setup

After installing npm dependencies, run:

```bash
cd ios && pod install && cd ..
```

**Note**: If you encounter encoding issues, set UTF-8 encoding:
```bash
export LANG=en_US.UTF-8 && cd ios && pod install && cd ..
```

**Important**: `react-native-worklets` is required as a peer dependency for `react-native-reanimated`. It's already included in `package.json`.

## Important Notes

1. **Babel Configuration**: The `babel.config.js` has been updated to include the `react-native-reanimated/plugin`. Make sure to restart Metro bundler after installing dependencies.

2. **Metro Bundler**: After installing new dependencies, restart Metro:
   ```bash
   npm start -- --reset-cache
   ```

3. **Rebuild App**: You may need to rebuild the app after installing native dependencies:
   - iOS: `npm run ios`
   - Android: `npm run android`

## Accordion Component

The new `Accordion` component has been created in `src/components/Accordion.tsx` and is being used in the Home screen to replace the previous `CategorySelector` and `SortBySelector` components.

### Features:
- Smooth expand/collapse animation using `react-native-collapsible`
- Animated chevron rotation using `react-native-reanimated`
- Customizable styling
- Selected option highlighting with primary color (#01B4E4)

