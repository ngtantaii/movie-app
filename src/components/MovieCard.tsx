import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { IMovie } from '../api/types';
import { IMAGE_BASE_URL } from '@env';

interface Props {
  movie: IMovie;
  onPress: (movie: IMovie) => void;
}

export const MovieCard: React.FC<Props> = ({ movie, onPress }) => {
  const imageUrl = movie.poster_path
    ? { uri: `${IMAGE_BASE_URL}${movie.poster_path}` }
    : undefined; // Add a placeholder image if needed (P2)

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(movie)}>
      <Image source={imageUrl} style={styles.poster} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.date}>{movie.release_date}</Text>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview}
        </Text>
      </View>
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
  },
  poster: {
    width: 100,
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 12,
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
    color: '#444',
    lineHeight: 18,
  },
});
