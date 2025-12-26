import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { capitalizeWords } from '../utils';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

export interface IAccordionOption {
  label: string;
  value: string;
}

interface AccordionProps {
  title: string;
  options: IAccordionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  renderSelectedLabel?: (value: string) => string;
  isExpanded?: boolean;
  onToggle?: () => void;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  optionStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  selectedOptionStyle?: ViewStyle;
  selectedOptionTextStyle?: TextStyle;
  isCapitalizeWords?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  renderSelectedLabel,
  isExpanded: controlledIsExpanded,
  onToggle,
  containerStyle,
  headerStyle,
  titleStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  selectedOptionTextStyle,
  isCapitalizeWords = false,
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isExpanded =
    controlledIsExpanded !== undefined
      ? controlledIsExpanded
      : internalIsExpanded;

  // Animation for chevron rotation
  const rotation = useSharedValue(controlledIsExpanded ? 90 : 0);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      const newExpanded = !internalIsExpanded;
      setInternalIsExpanded(newExpanded);
      rotation.value = withTiming(newExpanded ? 90 : 0, { duration: 200 });
    }
  };

  // Update animation when controlled isExpanded changes
  useEffect(() => {
    if (controlledIsExpanded !== undefined) {
      rotation.value = withTiming(controlledIsExpanded ? 90 : 0, {
        duration: 200,
      });
    }
  }, [controlledIsExpanded, rotation]);

  const handleSelect = (value: string) => {
    onSelect(value);
    if (onToggle) {
      onToggle(); // Close accordion when controlled
    } else {
      setInternalIsExpanded(false);
      rotation.value = withTiming(0, { duration: 200 });
    }
  };

  const getSelectedLabel = () => {
    if (renderSelectedLabel) {
      return renderSelectedLabel(selectedValue);
    }
    const selectedOption = options.find(opt => opt.value === selectedValue);

    let label = selectedOption ? selectedOption.label : title || '';

    if (isCapitalizeWords) {
      return capitalizeWords(label);
    }
    return label ?? '';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[styles.accordionWrapper, isExpanded && styles.expandedWrapper]}
      >
        <TouchableOpacity
          style={[styles.header, headerStyle]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Text style={[styles.title, titleStyle]}>{getSelectedLabel()}</Text>
          <Animated.View style={iconAnimatedStyle}>
            <Icon name="ChevronRight" size={16} color={colors.text.primary} />
          </Animated.View>
        </TouchableOpacity>

        <Collapsible collapsed={!isExpanded}>
          <View style={[styles.optionsContainer]}>
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    optionStyle,
                    isSelected && [styles.selectedOption, selectedOptionStyle],
                    index === options.length - 1 && styles.lastOption,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      optionTextStyle,
                      isSelected && [
                        styles.selectedOptionText,
                        selectedOptionTextStyle,
                      ],
                    ]}
                  >
                    {isCapitalizeWords
                      ? capitalizeWords(option.label)
                      : option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Collapsible>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  accordionWrapper: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  expandedWrapper: {
    borderColor: colors.border.light,
    zIndex: 1000,
    ...shadows.large,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.background.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  title: {
    fontWeight: typography.fontWeight.normal,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    flex: 1,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    borderRadius: borderRadius.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  option: {
    padding: spacing.md,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    minHeight: 44,
    backgroundColor: colors.gray[50],
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.normal,
  },
  selectedOptionText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.medium,
  },
});
