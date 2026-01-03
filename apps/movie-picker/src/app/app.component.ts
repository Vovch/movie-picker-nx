import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {HTTPService} from './http.service';
import {MoviesService} from './movies.service';
import {AuthenticationService} from './authentication.service';
import {fromEvent, Subscription} from 'rxjs';

@Component({
    selector: 'movie-picker-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
    isOffline = !navigator.onLine;
    offlineMessage = '';
    private onlineSubscription?: Subscription;
    private offlineSubscription?: Subscription;

    constructor(private http: HTTPService, private moviesService: MoviesService, private auth: AuthenticationService) {}

    ngOnInit() {
        const {login, hash} = this.auth.getAuthInfo();

        if (login && hash) {
          this.moviesService.fetchUserLists(login, hash);
        }

        if (this.isOffline) {
            this.setOfflineMessage();
        }

        this.watchNetworkStatus();
        this.loadMovies();
    }

    ngOnDestroy() {
        this.onlineSubscription?.unsubscribe();
        this.offlineSubscription?.unsubscribe();
    }

    private watchNetworkStatus() {
        this.onlineSubscription = fromEvent(window, 'online').subscribe(() => {
            this.isOffline = false;
            this.offlineMessage = '';
            this.loadMovies();
        });

        this.offlineSubscription = fromEvent(window, 'offline').subscribe(() => {
            this.setOfflineMessage();
        });
    }

    private loadMovies() {
        this.http.getMovies().subscribe({
            next: (movieList) => {
                this.isOffline = false;
                this.offlineMessage = '';
                this.moviesService.changeMoviesList(movieList);
                this.http.cacheMoviesList(movieList);
            },
            error: (error) => {
                this.handleMoviesLoadFailure(error);
            }
        });
    }

    private async handleMoviesLoadFailure(error?: unknown) {
        const isNetworkUnavailable =
            !navigator.onLine || (error instanceof HttpErrorResponse && error.status === 0);

        if (isNetworkUnavailable) {
            this.setOfflineMessage();
            const cachedMovies = await this.http.getCachedMovies();

            if (cachedMovies) {
                this.moviesService.changeMoviesList(cachedMovies);
            }
        }
    }

    private setOfflineMessage() {
        this.isOffline = true;
        this.offlineMessage = 'Internet connection unavailable. Showing cached movies list.';
    }
}
