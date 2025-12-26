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
            <Icon name="ChevronRight" size={16} color="#000" />
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
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  expandedWrapper: {
    borderColor: '#E0E0E0',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  title: {
    fontWeight: '400',
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  option: {
    padding: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    minHeight: 44,
    backgroundColor: '#F8F8F8'
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#00B4E4',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
});
