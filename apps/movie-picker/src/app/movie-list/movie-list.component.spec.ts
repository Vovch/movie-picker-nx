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

        expect(rowOne.querySelector('td').textContent).toContain('Movie 1');
        expect(rowOne.querySelectorAll('td')[1].textContent).toContain('Movie 1 Original');
        expect(rowOne.querySelectorAll('td')[2].textContent).toContain('Director 1');
        expect(rowOne.querySelectorAll('td')[3].textContent).toContain('2020');
        expect(rowOne.querySelectorAll('td')[4].textContent).toContain('2021');
        expect(rowOne.querySelectorAll('td')[5].textContent).toContain('120');
        expect(rowTwo.querySelector('td').textContent).toContain('Movie 2');
        expect(rowTwo.querySelectorAll('td')[1].textContent).toContain('Movie 2 Original');
        expect(rowTwo.querySelectorAll('td')[2].textContent).toContain('Director 2');
        expect(rowTwo.querySelectorAll('td')[3].textContent).toContain('2021');
        expect(rowTwo.querySelectorAll('td')[4].textContent).toContain('2022');
        expect(rowTwo.querySelectorAll('td')[5].textContent).toContain('110');
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

    it('should render no movies', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('table').textContent).toContain('No movies found');
    });

    it('should render search input', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('input').getAttribute('placeholder')).toContain('Search');
    });
});
