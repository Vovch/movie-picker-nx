import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IGetMoviesApiResponse, ILoginRequest, TGetUserMoviesModelResponse} from '@movie-picker/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getMovies() {
    return this.http.get<IGetMoviesApiResponse>(this.apiUrl + '/movies');
  }

  getUserMovies(login: string, hash: string) {
    return this.login(login, hash);
  }

  changeMovieStatus(login: string, hash: string, listId: string, movieId: number, status: string | null) {
    return this.http.post<void>(this.apiUrl + '/users/changeMovieStatus', {login, hash, listId, movieId, status});
  }

  login(login: string, hash: string) {
    return this.http.post<TGetUserMoviesModelResponse>(this.apiUrl + '/users/getUserMovies', {
      login,
      hash,
    } as ILoginRequest);
  }

  register(login: string, hash: string, captchaResponse: string) {
    return this.http.post<void>(this.apiUrl + '/users', {
      login,
      hash,
      captchaResponse,
    } as ILoginRequest);
  }
}
