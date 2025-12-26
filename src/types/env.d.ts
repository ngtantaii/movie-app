declare module '@env' {
  export const API_URL: string;
  export const API_KEY: string;
  export const IMAGE_BASE_URL: string;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
