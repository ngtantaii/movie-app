import React from 'react';
import { View, ViewStyle } from 'react-native';
import * as Icons from '../assets/svgs';

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'black', style }) => {
  // Get the corresponding icon component based on name
  const IconComponent = Icons[name];

  // Check if icon exists to prevent app crash
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found!`);
    return null;
  }

  // If style is provided, wrap in View; otherwise render directly
  if (style) {
    return (
      <View style={style}>
        <IconComponent size={size} color={color} />
      </View>
    );
  }

  return <IconComponent size={size} color={color} />;
};