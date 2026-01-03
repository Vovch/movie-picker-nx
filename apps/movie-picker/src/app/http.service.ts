import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IGetMoviesApiResponse, ILoginRequest, TGetUserMoviesModelResponse, IMovie, IUserMovieList} from '@movie-picker/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  private apiUrl = environment.apiUrl;
  private readonly cacheName = 'movie-picker-movies';

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

  async cacheMoviesList(moviesList: IGetMoviesApiResponse) {
    if (!this.canUseCacheStorage()) {
      return;
    }

    const cache = await caches.open(this.cacheName);
    const response = new Response(JSON.stringify(moviesList), {
      headers: {'Content-Type': 'application/json'}
    });

    await cache.put(this.apiUrl + '/movies', response);
  }

  async getCachedMovies(): Promise<IGetMoviesApiResponse | null> {
    if (!this.canUseCacheStorage()) {
      return null;
    }

    const cache = await caches.open(this.cacheName);
    const cachedResponse = await cache.match(this.apiUrl + '/movies');

    if (!cachedResponse) {
      return null;
    }

    return cachedResponse.json();
  }

  private canUseCacheStorage(): boolean {
    return typeof window !== 'undefined' && 'caches' in window;
  }
}
