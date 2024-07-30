import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGetMoviesApiResponse, TGetListsApiResponse, TGetUserMoviesModelResponse } from '@movie-picker/api-interfaces';
import { HTTPService } from './http.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private lists = new BehaviorSubject<TGetListsApiResponse>([]);
  private userLists = new BehaviorSubject<TGetUserMoviesModelResponse>([]);
  private movies = new BehaviorSubject<IGetMoviesApiResponse>({
    list: [],
    listId: '',
    name: '',
  });
  lists$ = this.lists.asObservable();
  movies$ = this.movies.asObservable();
  userLists$ = this.userLists.asObservable();

  constructor(private http: HTTPService, private auth: AuthenticationService) {}

  changeLists = (lists: TGetListsApiResponse) => {
    this.lists.next(lists);
  };

  changeUserLists = (value: TGetUserMoviesModelResponse) => {
    this.userLists.next(value);
  };

  changeMoviesList = (moviesList: IGetMoviesApiResponse) => {
    this.movies.next(moviesList);
  };

  fetchUserLists = (login: string, hash: string) => {
    this.http.getUserMovies(login, hash).subscribe((lists: TGetUserMoviesModelResponse) => this.userLists.next(lists));
  };

  selectList = (listId?: string) => {
    this.http.getMovies(listId).subscribe(this.changeMoviesList);
  };

  changeMovieStatus = (listId: string, movieId: number, status: string | null) => {
    const { login, hash } = this.auth.getAuthInfo();

    this.http.changeMovieStatus(login as string, hash as string, listId, movieId, status).subscribe(() => {
      let userLists = this.userLists.value.filter((list) => !(list.listId === listId && list.movieId === movieId));

      if (status) {
        userLists.push({ listId, movieId, status });
      } else {
        userLists = userLists.filter((list) => list.listId !== listId || list.movieId !== movieId);
      }

      this.changeUserLists(userLists);
    });
  };
}
