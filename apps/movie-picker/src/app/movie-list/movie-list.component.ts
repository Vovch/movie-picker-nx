import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IMovie } from '@movie-picker/api-interfaces';
import { orderBy } from 'lodash';

type MovieKey = keyof Omit<IMovie, 'id'>;
type SortKey = MovieKey | null;
type SortOrder = 'asc' | 'desc' | null;

@Component({
    selector: 'movie-picker-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.less'],
})
export class MovieListComponent implements OnChanges {
    @Input() movies: IMovie[] = [];
    @Output() selectMovie = new EventEmitter<IMovie>();

    columnNames: MovieKey[] = [];
    search = '';
    filteredMovies: IMovie[] = [];
    sortKey: SortKey = null;
    sortOrder: SortOrder = null;

    columnLabels: { [key in MovieKey]: string } = {
        name: 'Movie Title',
        originalName: 'Original Title',
        director: 'Director',
        yearProduced: 'Year Produced',
        yearAdded: 'Year Added to Registry',
        durationMinutes: 'Duration (minutes)',
    };

    ngOnChanges() {
        if (this.movies.length) {
            this.columnNames = Object.keys(this.movies[0]).filter((key) => key !== 'id') as MovieKey[];
            this.resetSort();
            this.updateFilteredMovies();
        } else {
            this.filteredMovies = [];
        }
    }

    resetSort() {
        this.sortKey = null;
        this.sortOrder = null;
    }

    updateFilteredMovies() {
        this.filterMovies();
        this.sortMovies();
    }

    filterMovies() {
        const caseInsensitiveSearch = this.search.toLowerCase();

        this.filteredMovies = this.movies.filter((movie) => {
            return Object.entries(movie).some(
                ([key, value]) => key !== 'id' && String(value).toLowerCase().includes(caseInsensitiveSearch)
            );
        });
    }

    handleSearchChange($event: Event) {
        this.search = ($event.target as HTMLInputElement).value;
        this.updateFilteredMovies();
    }

    handleRowClick(movie: IMovie) {
        this.selectMovie.emit(movie);
    }

    handleSort(column: SortKey) {
        if (column === this.sortKey) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : this.sortOrder === 'desc' ? null : 'asc';
        } else {
            this.sortKey = column;
            this.sortOrder = 'asc';
        }

        this.updateFilteredMovies();
    }

    private sortMovies() {
        if (this.sortKey && this.sortOrder) {
            this.filteredMovies = orderBy(this.filteredMovies, [this.sortKey], [this.sortOrder]);
        }
    }
}
