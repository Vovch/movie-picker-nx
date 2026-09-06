import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListComponent } from './movie-list.component';

describe('MovieListComponent', () => {
    let component: MovieListComponent;
    let fixture: ComponentFixture<MovieListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovieListComponent],
        }).compileComponents();

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

    it('should render movies', () => {
        const movies = [
            {
                id: 1,
                name: 'Movie 1',
                originalName: 'Movie 1 Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2021',
                durationMinutes: 120,
            },
            {
                id: 2,
                name: 'Movie 2',
                originalName: 'Movie 2 Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2022',
                durationMinutes: 110,
            },
        ];

        // Trigger OnChanges by setting the input property
        component.movies = movies;
        component.ngOnChanges();
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const rowOne = compiled.querySelectorAll('tr')[1];
        const rowTwo = compiled.querySelectorAll('tr')[2];

        const rowOneCells = rowOne.querySelectorAll('td');
        const rowTwoCells = rowTwo.querySelectorAll('td');

        expect(rowOneCells[0].textContent.trim()).toBe('1');
        expect(rowOneCells[1].textContent).toContain('Movie 1');
        expect(rowOneCells[2].textContent).toContain('Movie 1 Original');
        expect(rowOneCells[3].textContent).toContain('Director 1');
        expect(rowOneCells[4].textContent).toContain('2020');
        expect(rowOneCells[5].textContent).toContain('2021');
        expect(rowOneCells[6].textContent).toContain('120');
        expect(rowTwoCells[0].textContent.trim()).toBe('2');
        expect(rowTwoCells[1].textContent).toContain('Movie 2');
        expect(rowTwoCells[2].textContent).toContain('Movie 2 Original');
        expect(rowTwoCells[3].textContent).toContain('Director 2');
        expect(rowTwoCells[4].textContent).toContain('2021');
        expect(rowTwoCells[5].textContent).toContain('2022');
        expect(rowTwoCells[6].textContent).toContain('110');
        expect(compiled.querySelector('table').textContent).toContain('Total: 2 movies.');
    });

    it('should render search results', () => {
        const movies = [
            {
                id: 1,
                name: 'Movie 1',
                originalName: 'Movie 1 Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2021',
                durationMinutes: 100,
            },
            {
                id: 2,
                name: 'Movie 2',
                originalName: 'Movie 2 Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2022',
                durationMinutes: 90,
            },
        ];
        // Trigger OnChanges by setting the input property
        component.movies = movies;
        component.search = 'Movie 1';
        component.ngOnChanges();
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('table').textContent).toContain('Movie 1');
        expect(compiled.querySelector('table').textContent).not.toContain('Movie 2');
    });

    it('should render sorted movies', () => {
        const movies = [
            {
                id: 1,
                name: 'Movie 1',
                originalName: 'Movie 1 Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2021',
                durationMinutes: 120,
            },
            {
                id: 2,
                name: 'Movie 2',
                originalName: 'Movie 2 Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2022',
                durationMinutes: 110,
            },
            {
                id: 3,
                name: 'Movie 3',
                originalName: 'Movie 3 Original',
                director: 'Director 3',
                yearProduced: '2022',
                yearAdded: '2023',
                durationMinutes: 130,
            },
        ];

        component.movies = movies;
        component.ngOnChanges();
        component.handleSort('name');
        component.handleSort('name');
        fixture.detectChanges();

        const compiled = fixture.nativeElement;

        expect(compiled.querySelectorAll('tr')[1].textContent).toContain('Movie 3');
        expect(compiled.querySelectorAll('tr')[2].textContent).toContain('Movie 2');
        expect(compiled.querySelectorAll('tr')[3].textContent).toContain('Movie 1');
    });

    it('should sort by multiple columns when different headers are clicked', () => {
        const movies = [
            {
                id: 1,
                name: 'B Movie',
                originalName: 'B Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2020',
                durationMinutes: 120,
            },
            {
                id: 2,
                name: 'A Movie',
                originalName: 'A Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2020',
                durationMinutes: 110,
            },
            {
                id: 3,
                name: 'C Movie',
                originalName: 'C Original',
                director: 'Director 3',
                yearProduced: '2019',
                yearAdded: '2019',
                durationMinutes: 130,
            },
        ];

        component.movies = movies;
        component.ngOnChanges();
        component.handleSort('yearAdded');
        component.handleSort('name');
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const rows = compiled.querySelectorAll('tbody tr');

        expect(rows[0].textContent).toContain('C Movie');
        expect(rows[1].textContent).toContain('A Movie');
        expect(rows[2].textContent).toContain('B Movie');
        expect(compiled.querySelector('[data-sort-priority="1"]').textContent).toContain('Year Added');
        expect(compiled.querySelector('[data-sort-priority="2"]').textContent).toContain('Movie Title');
    });

    it('should return a column to a neutral state on the third click', () => {
        const movies = [
            {
                id: 1,
                name: 'Movie 1',
                originalName: 'Movie 1 Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2021',
                durationMinutes: 120,
            },
            {
                id: 2,
                name: 'Movie 2',
                originalName: 'Movie 2 Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2022',
                durationMinutes: 110,
            },
            {
                id: 3,
                name: 'Movie 3',
                originalName: 'Movie 3 Original',
                director: 'Director 3',
                yearProduced: '2022',
                yearAdded: '2023',
                durationMinutes: 130,
            },
        ];

        component.movies = movies;
        component.ngOnChanges();
        component.handleSort('name');
        component.handleSort('name');
        component.handleSort('name');
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const rows = compiled.querySelectorAll('tbody tr');

        expect(rows[0].textContent).toContain('Movie 1');
        expect(rows[1].textContent).toContain('Movie 2');
        expect(rows[2].textContent).toContain('Movie 3');
        expect(compiled.querySelector('[data-sort-order]')).toBeNull();
        expect(component.sorts).toEqual([]);
    });

    it('should keep remaining sort columns after a column is cleared', () => {
        const movies = [
            {
                id: 1,
                name: 'B Movie',
                originalName: 'B Original',
                director: 'Director 1',
                yearProduced: '2020',
                yearAdded: '2020',
                durationMinutes: 120,
            },
            {
                id: 2,
                name: 'A Movie',
                originalName: 'A Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2020',
                durationMinutes: 110,
            },
            {
                id: 3,
                name: 'C Movie',
                originalName: 'C Original',
                director: 'Director 3',
                yearProduced: '2019',
                yearAdded: '2019',
                durationMinutes: 130,
            },
        ];

        component.movies = movies;
        component.ngOnChanges();
        component.handleSort('yearAdded');
        component.handleSort('name');
        component.handleSort('yearAdded');
        component.handleSort('yearAdded');
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const rows = compiled.querySelectorAll('tbody tr');

        expect(rows[0].textContent).toContain('A Movie');
        expect(rows[1].textContent).toContain('B Movie');
        expect(rows[2].textContent).toContain('C Movie');
        expect(compiled.querySelector('.name').getAttribute('data-sort-order')).toBe('asc');
        expect(compiled.querySelector('.yearAdded').getAttribute('data-sort-order')).toBeNull();
    });

    it('should render no movies', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('table').textContent).toContain('No movies found');
    });

    it('should render search input', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('input').getAttribute('placeholder')).toContain('Search');
    });
});
