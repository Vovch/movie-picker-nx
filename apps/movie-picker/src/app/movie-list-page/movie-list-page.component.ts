import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MoviesService} from '../movies.service';
import {IMovie, IGetMoviesApiResponse, TGetUserMoviesModelResponse, EMovieStatus} from '@movie-picker/api-interfaces';
import {EMovieTab} from './movie-list-page.enums';
import {AuthenticationService} from '../authentication.service';

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

    filterMovies(userLists: TGetUserMoviesModelResponse = this.userLists as TGetUserMoviesModelResponse) {
        if (!this.movies) {
            return;
        }

        switch (this.tab) {
            case EMovieTab.ALL:
                this.filteredMovies = this.movies;
                break;
            case EMovieTab.WATCHED:
                this.filteredMovies = this.movies.filter(({id}) =>
                    userLists.some(
                        ({listId, movieId, status}) =>
                            listId === this.listId && movieId === id && status === EMovieStatus.WATCHED,
                    ),
                );
                break;
            case EMovieTab.POSTPONED:
                this.filteredMovies = this.movies.filter(({id}) =>
                    userLists.some(
                        ({listId, movieId, status}) =>
                            listId === this.listId && movieId === id && status === EMovieStatus.POSTPONED,
                    ),
                );
                break;
            case EMovieTab.NEW:
            default:
                this.filteredMovies = this.movies.filter(
                    ({id}) => !userLists.some(({listId, movieId}) => listId === this.listId && movieId === id),
                );
                break;
        }
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

    handleSelectChange($event: any) {
      this.tab = $event.target.value;
      this.filterMovies();
    }
}
