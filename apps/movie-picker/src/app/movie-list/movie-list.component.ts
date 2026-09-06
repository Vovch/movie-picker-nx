import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IMovie } from '@movie-picker/api-interfaces';
import { orderBy } from 'lodash';

type MovieKey = keyof Omit<IMovie, 'id'>;
type SortOrder = 'asc' | 'desc';

interface SortCriterion {
    key: MovieKey;
    order: SortOrder;
}

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
    sorts: SortCriterion[] = [];

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
        this.sorts = [];
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

    handleSort(column: MovieKey) {
        this.updateSortColumn(column);
        this.updateFilteredMovies();
    }

    getSort(column: MovieKey): SortCriterion | undefined {
        return this.sorts.find((sort) => sort.key === column);
    }

    getSortPriority(column: MovieKey): number | null {
        if (this.sorts.length < 2) {
            return null;
        }

        const index = this.sorts.findIndex((sort) => sort.key === column);

        return index === -1 ? null : index + 1;
    }

    getAriaSort(column: MovieKey): 'ascending' | 'descending' | 'none' {
        const sort = this.getSort(column);

        if (!sort) {
            return 'none';
        }

        return sort.order === 'asc' ? 'ascending' : 'descending';
    }

    private updateSortColumn(column: MovieKey) {
        const index = this.sorts.findIndex((sort) => sort.key === column);

        if (index === -1) {
            this.sorts = [...this.sorts, { key: column, order: 'asc' }];
            return;
        }

        this.cycleSortAt(index);
    }

    private cycleSortAt(index: number) {
        const current = this.sorts[index];

        if (current.order === 'asc') {
            this.sorts = this.sorts.map((sort, sortIndex) =>
                sortIndex === index ? { ...sort, order: 'desc' } : sort
            );
            return;
        }

        this.sorts = this.sorts.filter((_, sortIndex) => sortIndex !== index);
    }

    private sortMovies() {
        if (this.sorts.length) {
            this.filteredMovies = orderBy(
                this.filteredMovies,
                this.sorts.map((sort) => sort.key),
                this.sorts.map((sort) => sort.order)
            );
        }
    }
}
