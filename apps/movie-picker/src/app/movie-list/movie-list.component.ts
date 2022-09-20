import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {IMovie} from "@movie-picker/api-interfaces";

@Component({
    selector: 'movie-picker-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.less'],
})
export class MovieListComponent implements OnChanges {
    @Input() movies: IMovie[] = [];
    @Output() selectMovie = new EventEmitter<IMovie>();

    columns: (keyof IMovie)[] = [];
    search = '';
    filteredMovies: IMovie[] = [];

    ngOnChanges() {
        if (this.movies.length) {
            this.columns = Object.keys(this.movies[0]).filter((key) => key !== 'id') as (keyof IMovie)[];
            this.filterMovies();
        } else {
          this.filteredMovies = [];
        }
    }

    filterMovies() {
        const caseInsensitiveSearch = this.search.toLowerCase();

        this.filteredMovies = this.movies.filter((movie) => {
            return Object.entries(movie).some(
                ([key, value]) => key !== 'id' && String(value).toLowerCase().includes(caseInsensitiveSearch),
            );
        });
    }

    handleSearchChange($event: Event) {
        this.search = ($event.target as HTMLInputElement).value;
        this.filterMovies();
    }

    handleRowClick(movie: IMovie) {
      this.selectMovie.emit(movie);
    }
}
