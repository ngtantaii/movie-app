/** ============= START Enum zone ============= */

export enum EMovieCategory {
  NOW_PLAYING = 'now_playing',
  POPULAR = 'popular',
  UPCOMING = 'upcoming',
}

/** ============= END Enum zone ============= */

/** ============= START Interface zone ============= */

export interface IMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMovieResponse {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface IMovieDetail extends IMovie {
  belongs_to_collection: string | null;
  budget: number;
  genres: IGenre[];
  homepage: string;
  imdb_id: string | null;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  credits?: {
    cast: ICastMember[];
    crew: ICrewMember[];
  };
}

export interface ICastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface ICrewMember {
  id: number;
  name: string;
  job: string;
}

/**
 * @description Gravatar avatar information
 */
export interface IGravatarAvatar {
  hash: string;
}

/**
 * @description TMDB avatar information
 */
export interface ITmdbAvatar {
  avatar_path: string | null;
}

/**
 * @description User avatar information containing both Gravatar and TMDB avatars
 */
export interface IAvatar {
  gravatar: IGravatarAvatar;
  tmdb: ITmdbAvatar;
}

/**
 * @description Account details for the authenticated user
 * @see https://developer.themoviedb.org/reference/account-details
 */
export interface IAccount {
  /** Avatar information (Gravatar and TMDB) */
  avatar: IAvatar;
  /** Account ID */
  id: number;
  /** ISO 639-1 language code (e.g., "en") */
  iso_639_1: string;
  /** ISO 3166-1 country code (e.g., "VN") */
  iso_3166_1: string;
  /** User's display name (may be empty string) */
  name: string;
  /** Whether the user includes adult content in their preferences */
  include_adult: boolean;
  /** Username */
  username: string;
}
/** ============= END Interface zone ============= */