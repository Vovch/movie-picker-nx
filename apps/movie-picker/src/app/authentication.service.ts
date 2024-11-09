import {Injectable} from '@angular/core';
import {HTTPService} from './http.service';
import {BehaviorSubject, tap} from 'rxjs';
import { IMovie, IUserMovieList } from '@movie-picker/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _login = localStorage.getItem('login');
  private _hash = localStorage.getItem('hash');

  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HTTPService) {
    this._isAuthenticated.next(Boolean(this._login && this._hash));
  }

  async generateHash(login: string, password: string) {
    const encoder = new TextEncoder();

    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(login.toLowerCase() + password));
    const hashHex = [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  getAuthInfo() {
    return {login: this._login, hash: this._hash};
  }

  private storeAuthInfo(login: string, hash: string) {
    this._login = login;
    this._hash = hash;

    localStorage.setItem('login', login.toLowerCase());
    localStorage.setItem('hash', hash);

    this._isAuthenticated.next(true);
  }

  async login(login: string, password: string) {
    const hash = await this.generateHash(login, password);

    const loginSubject = this.http.login(login, hash);

    return loginSubject.pipe(tap(() => {
      this.storeAuthInfo(login, hash);
    }));
  }

  async register(login: string, password: string, captcha: string) {
    const hash = await this.generateHash(login, password);

    const registrationSubject = this.http.register(login, hash, captcha);

    return registrationSubject.pipe(tap(() => {
      this.storeAuthInfo(login, hash);
      this.login(login, hash);
    }));
  }

  logOut() {
    this._login = null;
    this._hash = null;

    localStorage.removeItem('login');
    localStorage.removeItem('hash');

    this._isAuthenticated.next(false);
  }
}
