import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MoviesService } from '../movies.service';
import { EMovieStatus, IGetMoviesApiResponse, IMovie, TGetUserMoviesModelResponse } from '@movie-picker/api-interfaces';
import { EMovieTab } from './movie-list-page.enums';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'movie-picker-list-page',
    templateUrl: './movie-list-page.component.html',
    styleUrls: ['./movie-list-page.component.less'],
})
export class MovieListPageComponent implements OnInit, OnChanges {
    movies: IMovie[] = [];
    listId = '';
    isMovieModalOpen = false;
    selectedMovie: IMovie | null = null;
    tab: EMovieTab = EMovieTab.NEW;
    filteredMovies: IMovie[] = [];
    userLists?: TGetUserMoviesModelResponse = [];
    isAuthenticated = false;
    statuses: EMovieTab[] = Object.values(EMovieTab);
    badges: { [key in EMovieTab]: number } = {
        [EMovieTab.ALL]: 0,
        [EMovieTab.NEW]: 0,
        [EMovieTab.WATCHED]: 0,
        [EMovieTab.POSTPONED]: 0,
    };

    constructor(private moviesService: MoviesService, private auth: AuthenticationService) {}

    ngOnInit(): void {
        this.moviesService.movies$.subscribe((movieList: IGetMoviesApiResponse) => {
            this.movies = movieList.list;
            this.listId = movieList.listId;
            this.filterMovies();
        });
        this.moviesService.userLists$.subscribe((lists) => {
            this.userLists = lists;
            this.filterMovies(lists);
        });
        this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
            this.isAuthenticated = isAuthenticated;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.movies && changes['tab']) {
            this.filterMovies();
        }
    }

    fillBadges() {
        this.badges = {
            [EMovieTab.ALL]: this.calcFilteredMovies(EMovieTab.ALL).length,
            [EMovieTab.NEW]: this.calcFilteredMovies(EMovieTab.NEW).length,
            [EMovieTab.WATCHED]: this.calcFilteredMovies(EMovieTab.WATCHED).length,
            [EMovieTab.POSTPONED]: this.calcFilteredMovies(EMovieTab.POSTPONED).length,
        };
    }

    calcFilteredMovies(
        tab: EMovieTab,
        userLists: TGetUserMoviesModelResponse = this.userLists as TGetUserMoviesModelResponse
    ) {
        switch (tab) {
            case EMovieTab.ALL:
                return this.movies;
            case EMovieTab.WATCHED:
                return this.movies.filter(({ id }) =>
                    userLists.some(
                        ({ listId, movieId, status }) =>
                            listId === this.listId && movieId === id && status === EMovieStatus.WATCHED
                    )
                );
            case EMovieTab.POSTPONED:
                return this.movies.filter(({ id }) =>
                    userLists.some(
                        ({ listId, movieId, status }) =>
                            listId === this.listId && movieId === id && status === EMovieStatus.POSTPONED
                    )
                );
            case EMovieTab.NEW:
            default:
                return this.movies.filter(
                    ({ id }) => !userLists.some(({ listId, movieId }) => listId === this.listId && movieId === id)
                );
        }
    }

    filterMovies(userLists?: TGetUserMoviesModelResponse) {
        if (!this.movies) {
            return;
        }

        this.filteredMovies = this.calcFilteredMovies(this.tab, userLists);
        this.fillBadges();
    }

    handleClickRandomMovie() {
        if (!this.filteredMovies) {
            return;
        }

        const randomMovieIndex = Math.floor(Math.random() * this.filteredMovies.length);

        this.selectedMovie = this.filteredMovies[randomMovieIndex];
        this.isMovieModalOpen = true;
    }

    handleSelectMovie(movie: IMovie) {
        this.selectedMovie = movie;
        this.isMovieModalOpen = true;
    }

    handleHideModal() {
        this.isMovieModalOpen = false;
        this.selectedMovie = null;
        this.filterMovies();
    }

    handleSelectAllClick() {
        this.tab = EMovieTab.ALL;
        this.filterMovies();
    }

    handleSelectNewClick() {
        this.tab = EMovieTab.NEW;
        this.filterMovies();
    }

    handleSelectWatchedClick() {
        this.tab = EMovieTab.WATCHED;
        this.filterMovies();
    }

    handleSelectPostponedClick() {
        this.tab = EMovieTab.POSTPONED;
        this.filterMovies();
    }

    handleSelectChange($event: Event) {
        this.tab = ($event.target as HTMLButtonElement).value as EMovieTab;
        this.filterMovies();
    }
}
