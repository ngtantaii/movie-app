import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDateLong } from '../utils';
import { IMovie } from '../api/types';
import { IMAGE_BASE_URL } from '@env';
import { Icon } from './Icon';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

interface Props {
  movie: IMovie;
  onPress: (movie: IMovie) => void;
  onRemove?: (movieId: number) => void;
}

export const MovieCard: React.FC<Props> = ({ movie, onPress, onRemove }) => {
  const imageUrl = movie.poster_path
    ? { uri: `${IMAGE_BASE_URL}${movie.poster_path}` }
    : undefined;

  // Format date: "19 July 2023"
  const formattedDate = formatDateLong(movie.release_date);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(movie)}>
      <Image source={imageUrl} style={styles.poster} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview}
        </Text>
      </View>
      {onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(movie.id)}
          activeOpacity={0.7}
        >
          <Icon name="Close" size={16} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    ...shadows.medium,
    overflow: 'hidden',
    height: 140,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: spacing.md,
    paddingRight: 40,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  overview: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.sm,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
