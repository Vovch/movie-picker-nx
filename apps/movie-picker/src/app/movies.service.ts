import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IGetMoviesApiResponse,
  TGetUserMoviesModelResponse,
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
}
