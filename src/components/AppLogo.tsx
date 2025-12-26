import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TMDBLogo } from '../assets/svgs';

interface AppLogoProps {
  width?: number;
  height?: number;
  containerStyle?: ViewStyle;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  width = 120,
  height = 40,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TMDBLogo width={width} height={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

