import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { IMovie } from '../api/types';
import { IMAGE_BASE_URL } from '@env';
import { Icon } from './Icon';

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
  const formattedDate = movie.release_date
    ? format(new Date(movie.release_date), 'd MMMM yyyy')
    : movie.release_date;

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
          <Icon name="Close" size={16} color="#000" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//     height: 150,
//   },
//   poster: {
//     width: 100,
//     height: '100%',
//   },
//   info: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 4,
//   },
//   date: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   overview: {
//     fontSize: 12,
//     color: '#444',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    height: 140,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 12,
    paddingRight: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  overview: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
