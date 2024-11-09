import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IGetMoviesApiResponse,
  TGetUserMoviesModelResponse,
  IMovie,
  IUserMovieList,
} from '@movie-picker/api-interfaces';
import { HTTPService } from './http.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private userLists = new BehaviorSubject<TGetUserMoviesModelResponse>([]);
  private movies = new BehaviorSubject<IGetMoviesApiResponse>({
    list: [],
    listId: '',
    name: '',
  });
  movies$ = this.movies.asObservable();
  userLists$ = this.userLists.asObservable();

  constructor(private http: HTTPService, private auth: AuthenticationService) {}

  changeUserLists = (value: TGetUserMoviesModelResponse) => {
    this.userLists.next(value);
  };

  changeMoviesList(moviesList: IGetMoviesApiResponse) {
    this.movies.next(moviesList);
  }

  fetchUserLists(login: string, hash: string) {
    this.http
      .getUserMovies(login, hash)
      .subscribe((lists: TGetUserMoviesModelResponse) =>
        this.userLists.next(lists)
      );
  }

  changeMovieStatus(listId: string, movieId: number, status: string | null) {
    const { login, hash } = this.auth.getAuthInfo();

    this.http
      .changeMovieStatus(
        login as string,
        hash as string,
        listId,
        movieId,
        status
      )
      .subscribe(() => {
        let userLists = this.userLists.value.filter(
          (list) => !(list.listId === listId && list.movieId === movieId)
        );

        if (status) {
          userLists.push({ listId, movieId, status });
        } else {
          userLists = userLists.filter(
            (list) => list.listId !== listId || list.movieId !== movieId
          );
        }

        this.changeUserLists(userLists);
      });
  }

  createMovie(movie: IMovie) {
    this.http.createMovie(movie).subscribe((newMovie: IMovie) => {
      const currentMovies = this.movies.value;
      currentMovies.list.push(newMovie);
      this.changeMoviesList(currentMovies);
    });
  }

  updateMovie(id: number, movie: IMovie) {
    this.http.updateMovie(id, movie).subscribe((updatedMovie: IMovie) => {
      const currentMovies = this.movies.value;
      const index = currentMovies.list.findIndex(m => m.id === id);
      if (index !== -1) {
        currentMovies.list[index] = updatedMovie;
        this.changeMoviesList(currentMovies);
      }
    });
  }

  deleteMovie(id: number) {
    this.http.deleteMovie(id).subscribe(() => {
      const currentMovies = this.movies.value;
      currentMovies.list = currentMovies.list.filter(m => m.id !== id);
      this.changeMoviesList(currentMovies);
    });
  }
}
