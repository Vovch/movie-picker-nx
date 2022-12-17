import sortBy from 'lodash/sortBy'
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {IMovie} from "@movie-picker/api-interfaces";

enum ESortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

interface ISort {
  key: null | keyof IMovie;
  order: null | ESortOrder;
}

const defaultSort = {
  get sort() {
    return {
      key: null,
      order: null,
    }
  }
}

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
  sort: ISort = defaultSort.sort;

  ngOnChanges() {
    if (this.movies.length) {
      this.columns = Object.keys(this.movies[0]).filter((key) => key !== 'id') as (keyof IMovie)[];
      this.resetSort();
      this.filterMovies();
    } else {
      this.filteredMovies = [];
    }
  }

  resetSort() {
    this.sort = defaultSort.sort;
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

  handleSort(column: keyof IMovie) {
    const isSame = column === this.sort.key;
    let order = null;

    if (isSame && this.sort.order === ESortOrder.ASC) {
      order = ESortOrder.DESC;
    } else if (!isSame) {
      order = ESortOrder.ASC;
    }

    this.sort.key = order ? column : null;
    this.sort.order = order;


    this.filterMovies();

    if (this.sort.key) {
      const sorted = sortBy(this.filteredMovies, [column])

      this.filteredMovies = order === ESortOrder.ASC ? sorted : sorted.reverse();
    }
  }
}
