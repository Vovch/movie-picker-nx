import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListComponent } from './movie-list.component';

// export interface IMovie {
//   id: number;
//   name: string;
//   originalName: string;
//   director: string;
//   yearProduced: string;
//   yearAdded: string;
// }

// <h2 class="list__title">US National Film Registry</h2>

// <input
//   id="search"
//   class="search"
//   type="text"
//   [value]="search"
//   (input)="handleSearchChange($event)"
//   placeholder="Search"/>

// <table class="list">
//   <thead class="list__header">
//   <tr>
//     <th class="list__cell list__column-heading"
//         [class]='name'
//         (click)="handleSort(name)"
//         *ngFor="let name of columnNames">
//       <span *ngIf="sortKey === name">
//         {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
//       </span>
//       {{ columnLabels[name] }}
//     </th>
//   </tr>
//   </thead>
//   <tbody>
//   <tr class="list__row" *ngFor="let movie of filteredMovies" (click)="handleRowClick(movie)">
//     <td class="list__cell" *ngFor="let column of columnNames">{{ movie[column] }}</td>
//   </tr>
//   </tbody>
// </table>


describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('US National Film Registry');
  });

  it('should render movies',() => {
    const movies = [
      { id: 1, name: 'Movie 1', originalName: 'Movie 1 Original', director: 'Director 1', yearProduced: '2020', yearAdded: '2021' },
      { id: 2, name: 'Movie 2', originalName: 'Movie 2 Original', director: 'Director 2', yearProduced: '2021', yearAdded: '2022' }
    ];

    component.movies = movies;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('td').textContent).toContain('Movie 1');
  });

  it('should render search input', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input').getAttribute('placeholder')).toContain('Search');
  });
});
