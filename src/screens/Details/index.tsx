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
import { useDetailLogic } from './useDetailLogic';
import { IMAGE_BASE_URL } from '@env';
import { Icon, AppLogo, CircularProgress } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { formatDate, formatRuntime, getYearFromDate } from '../../utils';
import { DetailsScreenNavigationProp } from '../../types/navigation';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../../theme';

export const DetailsScreen = () => {
  const {
    movie,
    recommendations,
    loading,
    isFavorite,
    toggleWatchlist,
  } = useDetailLogic();

  const navigation = useNavigation<DetailsScreenNavigationProp>();

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;
  const year = getYearFromDate(movie.release_date);
  const formattedDate = formatDate(movie.release_date);
  const formattedRuntime = formatRuntime(movie.runtime);

  // Get production country code (first country)
  const countryCode =
    movie.production_countries && movie.production_countries.length > 0
      ? movie.production_countries[0].iso_3166_1
      : 'US';

  const handleRecommendationPress = (movieId: number) => {
    navigation.replace('Details', { movieId });
  };

  // Calculate score percentage (0-100)
  const scorePercentage = Math.round(movie.vote_average * 10);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      {/* App Logo Header */}
      <View style={styles.logoHeader}>
        <AppLogo width={120} height={40} />
      </View>
      {/* Header Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
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
              <Text style={styles.infoText}>
                <Text style={[styles.infoText, { fontWeight: 'bold' }]}>
                  Status:
                </Text>{' '}
                {movie.status}
              </Text>
              <Text style={styles.infoText}>
                <Text style={[styles.infoText, { fontWeight: 'bold' }]}>
                  Original Language:{' '}
                </Text>
                {movie.original_language.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* User Score & Director/Writer Row */}
          <View style={styles.scoreCrewRow}>
            <View style={styles.scoreRow}>
              <CircularProgress percentage={scorePercentage} />
              <Text style={styles.scoreLabel}>User Score</Text>
            </View>

            {/* Director & Writer Info */}
            <View style={{ flex: 1 }}>
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
                      director && writers.some(w => w.id === director.id);

                    return (
                      <View style={{ gap: 8 }}>
                        {director && (
                          <View style={styles.crewItem}>
                            <Text style={styles.crewName}>{director.name}</Text>
                            <Text style={styles.crewLabel}>
                              {isDirectorAlsoWriter
                                ? 'Director, Writer'
                                : 'Director'}
                            </Text>
                          </View>
                        )}
                        {writer && writer.id !== director?.id && (
                          <View style={styles.crewItem}>
                            <Text style={styles.crewName}>{writer.name}</Text>
                            <Text style={styles.crewLabel}>Writer</Text>
                          </View>
                        )}
                      </View>
                    );
                  })()}
                </View>
              )}
            </View>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            {movie.tagline || "She's everything. He's just Ken."}
          </Text>

          {/* Overview */}
          <View style={styles.descSection}>
            <Text style={styles.sectionHeader}>Overview</Text>
            <Text style={styles.overviewText}>{movie.overview}</Text>
          </View>

          {/* Add to Watchlist */}
          <TouchableOpacity
            style={[styles.watchBtn, isFavorite && styles.watchBtnActive]}
            onPress={toggleWatchlist}
          >
            <Icon
              name="Watchlist"
              size={18}
              color={isFavorite ? colors.text.white : colors.text.white}
            />
            <Text
              style={[
                styles.watchBtnText,
                isFavorite && styles.watchBtnTextActive,
              ]}
            >
              {isFavorite ? 'In Your Watchlist' : 'Add to Watchlist'}
            </Text>
          </TouchableOpacity>
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
                        uri:
                          recommendationPosterUrl ||
                          'https://via.placeholder.com/100',
                      }}
                      style={styles.recommendationImg}
                    />
                    <View style={styles.recommendationInfo}>
                      <Text
                        style={styles.recommendationTitle}
                        numberOfLines={2}
                      >
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
  container: { flex: 1, backgroundColor: colors.background.white },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.white,
  },
  logoHeader: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background.white,
  },
  // Navigation Bar
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
  },
  backButton: { padding: spacing.sm },
  navTitle: {
    color: colors.text.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.lg,
    flex: 1,
  },

  // Teal Blue Section
  blueSection: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  infoRow: { flexDirection: 'row', marginBottom: spacing.xl },
  poster: {
    width: 120,
    height: 150,
    borderRadius: borderRadius.lg,
    marginRight: spacing.lg,
  },
  infoCol: { flex: 1 },

  tagBadge: {
    borderWidth: 1,
    borderColor: colors.text.white,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  infoText: {
    color: colors.text.white,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  genreText: {
    color: colors.text.white,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },

  scoreCrewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  scoreRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.xl,
  },
  scoreCircleContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  scoreNumContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  scoreNumWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  scoreNum: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md,
  },
  scorePercent: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    marginLeft: 2,
  },
  scoreLabel: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
  },

  crewSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  crewItem: {
    marginBottom: spacing.xs,
  },
  crewName: {
    color: colors.text.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  crewLabel: {
    color: colors.text.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
  },

  tagline: {
    color: colors.text.white,
    fontStyle: 'italic',
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.lg,
  },
  descSection: { marginBottom: spacing.lg },
  sectionHeader: {
    color: colors.text.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  overviewText: {
    color: colors.text.white,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.xl,
  },

  watchBtn: {
    // backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.white,
    alignSelf: 'flex-start',
  },
  watchBtnActive: {
    backgroundColor: colors.successLight,
    borderColor: colors.successLight,
  },
  watchBtnText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },
  watchBtnTextActive: {
    color: colors.text.white,
  },

  // White Section
  whiteSection: {
    backgroundColor: colors.background.white,
    paddingVertical: spacing.xl,
  },
  blackHeader: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  castListContainer: { paddingLeft: spacing.xl },
  castCard: {
    width: 120,
    marginRight: 14,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    marginBottom: spacing.sm,
  },
  castImg: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  castInfo: { paddingHorizontal: spacing.sm },
  castName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  castChar: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },

  // Recommendations
  recommendationsListContainer: { paddingLeft: spacing.xl },
  recommendationCard: {
    width: 120,
    marginRight: 14,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.border.light,
  },
  recommendationImg: {
    width: '100%',
    height: 180,
  },
  recommendationInfo: {
    padding: spacing.sm,
  },
  recommendationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recommendationScore: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
  },
});
