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
  // Lấy ra component icon tương ứng dựa vào name
  const IconComponent = Icons[name];

  // Kiểm tra xem có icon đó không để tránh crash app
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found!`);
    return null;
  }

  // Nếu có style, wrap trong View; nếu không, render trực tiếp
  if (style) {
    return (
      <View style={style}>
        <IconComponent size={size} color={color} />
      </View>
    );
  }

  return <IconComponent size={size} color={color} />;
};