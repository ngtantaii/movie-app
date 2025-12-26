/**
 * Circular Progress Indicator Component
 * Displays a circular progress indicator with percentage
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../theme';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 4,
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle (dark green) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={colors.darkGreen}
        />
        {/* Unfilled portion (gray) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.gray[600]}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress circle (green) - only shows percentage */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.success}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showPercentage && (
        <View style={styles.textContainer}>
          <View style={styles.textWrapper}>
            <Text style={styles.percentageText}>{percentage}</Text>
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  percentageText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md,
  },
  percentSymbol: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    marginLeft: 2,
  },
});

