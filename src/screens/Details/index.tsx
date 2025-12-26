import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { format } from 'date-fns';
import { useDetailLogic } from './useDetailLogic';
import { IMAGE_BASE_URL } from '@env';
import { Icon, AppLogo } from '../../components';
import { useNavigation } from '@react-navigation/native';

export const DetailsScreen = () => {
  const {
    movie,
    recommendations,
    loading,
    // loadingRecommendations,
    isFavorite,
    toggleWatchlist,
    goBack,
  } = useDetailLogic();

  const navigation = useNavigation<any>();

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#01B4E4" />
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;
  const year = new Date(movie.release_date).getFullYear();

  // Format date: DD/MM/YYYY
  const formattedDate = movie.release_date
    ? format(new Date(movie.release_date), 'dd/MM/yyyy')
    : '';

  // Format runtime: Xh Ym
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;
  const formattedRuntime = `${runtimeHours}h ${runtimeMinutes}m`;

  // Get production country code (first country)
  const countryCode =
    movie.production_countries && movie.production_countries.length > 0
      ? movie.production_countries[0].iso_3166_1
      : 'US';

  const handleRecommendationPress = (movieId: number) => {
    navigation.replace('Details', { movieId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#01B4E4" />
      {/* App Logo Header */}
      <View style={styles.logoHeader}>
        <AppLogo width={120} height={40} />
      </View>
      {/* Header Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="ArrowLeft" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {movie.title} <Text style={{ fontWeight: 'normal' }}>({year})</Text>
        </Text>
      </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.blueSection}>
            <View style={styles.infoRow}>
              <Image
                source={{ uri: posterUrl || '' }}
                style={styles.poster}
                resizeMode="cover"
              />

              <View style={styles.infoCol}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>PG-13</Text>
                </View>
                <Text style={styles.infoText}>
                  {formattedDate} ({countryCode}) • {formattedRuntime}
                </Text>
                <Text style={styles.genreText}>
                  {movie.genres.map(g => g.name).join(', ')}
                </Text>
                <Text style={styles.infoText}>Status: {movie.status}</Text>
                <Text style={styles.infoText}>
                  Original Language: {movie.original_language.toUpperCase()}
                </Text>

                <View style={styles.scoreRow}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreNum}>
                      {Math.round(movie.vote_average * 10)}
                    </Text>
                  </View>
                  <Text style={styles.scoreLabel}>User Score</Text>
                </View>
              </View>
            </View>

            {/* Director & Writer Info */}
            {movie.credits?.crew && (
              <View style={styles.crewSection}>
                {(() => {
                  const directors = movie.credits.crew.filter(
                    c => c.job === 'Director',
                  );
                  const writers = movie.credits.crew.filter(
                    c => c.job === 'Writer' || c.job === 'Screenplay',
                  );
                  const director = directors[0];
                  const writer =
                    writers.find(w => w.id !== director?.id) || writers[0];

                  const isDirectorAlsoWriter =
                    director &&
                    writers.some(w => w.id === director.id);

                  return (
                    <>
                      {director && (
                        <Text style={styles.crewText}>
                          <Text style={styles.crewLabel}>
                            {isDirectorAlsoWriter
                              ? 'Director, Writer: '
                              : 'Director: '}
                          </Text>
                          {director.name}
                        </Text>
                      )}
                      {writer && writer.id !== director?.id && (
                        <Text style={styles.crewText}>
                          <Text style={styles.crewLabel}>Writer: </Text>
                          {writer.name}
                        </Text>
                      )}
                    </>
                  );
                })()}
              </View>
            )}

            {/* Tagline & Overview */}
            <View style={styles.descSection}>
              <Text style={styles.tagline}>
                {movie.tagline || "She's everything. He's just Ken."}
              </Text>

              <Text style={styles.sectionHeader}>Overview</Text>
              <Text style={styles.overviewText}>{movie.overview}</Text>

              {/* Add to Watchlist */}
              <TouchableOpacity
                style={[styles.watchBtn, isFavorite && styles.watchBtnActive]}
                onPress={toggleWatchlist}
              >
                <Icon name="Watchlist" size={18} color="white" />
                <Text style={styles.watchBtnText}>
                  {isFavorite ? 'In Your Watchlist' : 'Add to Watchlist'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Cast (White Background) */}
          <View style={styles.whiteSection}>
            <Text style={styles.blackHeader}>Top Billed Cast</Text>
            <FlatList
              horizontal
              data={movie.credits?.cast.slice(0, 10) || []}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castListContainer}
              renderItem={({ item }) => (
                <View style={styles.castCard}>
                  <Image
                    source={{
                      uri: item.profile_path
                        ? `${IMAGE_BASE_URL}${item.profile_path}`
                        : 'https://via.placeholder.com/100',
                    }}
                    style={styles.castImg}
                  />
                  <View style={styles.castInfo}>
                    <Text style={styles.castName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.castChar} numberOfLines={2}>
                      {item.character}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Section 3: Recommendations (White Background) */}
          {recommendations.length > 0 && (
            <View style={styles.whiteSection}>
              <Text style={styles.blackHeader}>Recommendations</Text>
              <FlatList
                horizontal
                data={recommendations}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsListContainer}
                renderItem={({ item }) => {
                  const recommendationPosterUrl = item.poster_path
                    ? `${IMAGE_BASE_URL}${item.poster_path}`
                    : null;
                  return (
                    <TouchableOpacity
                      style={styles.recommendationCard}
                      onPress={() => handleRecommendationPress(item.id)}
                    >
                      <Image
                        source={{
                          uri: recommendationPosterUrl || 'https://via.placeholder.com/100',
                        }}
                        style={styles.recommendationImg}
                      />
                      <View style={styles.recommendationInfo}>
                        <Text style={styles.recommendationTitle} numberOfLines={2}>
                          {item.title}
                        </Text>
                        <Text style={styles.recommendationScore}>
                          {Math.round(item.vote_average * 10)}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoHeader: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  // Navigation Bar
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#01B4E4',
  },
  backButton: { padding: 8 },
  navTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },

  // Teal Blue Section
  blueSection: {
    padding: 20,
    backgroundColor: '#01B4E4',
  },
  infoRow: { flexDirection: 'row', marginBottom: 20 },
  poster: { width: 120, height: 180, borderRadius: 10, marginRight: 16 },
  infoCol: { flex: 1, justifyContent: 'center' },

  tagBadge: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 8,
  },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  infoText: { color: 'white', fontSize: 14, marginBottom: 4 },
  genreText: {
    color: '#fff',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  },

  scoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#081c22',
    borderWidth: 3,
    borderColor: '#21d07a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scoreNum: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  scoreLabel: { color: 'white', fontWeight: 'bold' },

  crewSection: { marginTop: 16, marginBottom: 10 },
  crewText: { color: 'white', fontSize: 14, marginBottom: 4 },
  crewLabel: { fontWeight: 'bold' },

  descSection: { marginTop: 10 },
  tagline: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overviewText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  watchBtn: {
    backgroundColor: '#01B4E4',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  watchBtnActive: { backgroundColor: '#89ed9fff', borderColor: '#89ed9fff' },
  watchBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  // White Section
  whiteSection: { backgroundColor: 'white', paddingVertical: 20 },
  blackHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  castListContainer: { paddingLeft: 20 },
  castCard: {
    width: 120,
    marginRight: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // paddingBottom: 10,
    marginBottom: 8,
  },
  castImg: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  castInfo: { paddingHorizontal: 8 },
  castName: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  castChar: { fontSize: 12, color: '#666' },

  // Recommendations
  recommendationsListContainer: { paddingLeft: 20 },
  recommendationCard: {
    width: 120,
    marginRight: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: 'hidden',
  },
  recommendationImg: {
    width: '100%',
    height: 180,
  },
  recommendationInfo: {
    padding: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  recommendationScore: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});
