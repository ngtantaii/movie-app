/** ============= START Enum zone ============= */

export enum EMovieCategory {
  NOW_PLAYING = 'now_playing',
  POPULAR = 'popular',
  UPCOMING = 'upcoming',
}

/** ============= END Enum zone ============= */

/** ============= START Interface zone ============= */

export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface IMovieResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IMovieDetail extends IMovie {
  genres: { id: number; name: string }[];
  runtime: number;
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
/** ============= END Interface zone ============= */