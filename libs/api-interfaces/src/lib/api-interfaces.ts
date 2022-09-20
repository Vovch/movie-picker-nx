export interface ICreateUserRequest {
  login: string;
  hash: string;
}

export interface IMovie {
  id: number;
  name: string;
  originalName: string;
  yearProduced: string;
  yearAdded: string;
}

export interface IGetMoviesApiResponse {
  listId: string;
  name: string;
  list: IMovie[];
}

export interface IUserMovieList {
  listId: string;
  movieId: number;
  status: string | null;
}

export type TGetUserMoviesModelResponse = IUserMovieList[];

export interface ILoginRequest {
  login: string;
  hash: string;
  captchaResponse: string;
}

export enum EMovieStatus {
  WATCHED = 'WATCHED',
  POSTPONED = 'POSTPONED',
}
