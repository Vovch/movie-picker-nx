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
            },
            {
                id: 2,
                name: 'Movie 2',
                originalName: 'Movie 2 Original',
                director: 'Director 2',
                yearProduced: '2021',
                yearAdded: '2022',
            },
        ];

        // Trigger OnChanges by setting the input property
        component.movies = movies;
        component.ngOnChanges();
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('table').textContent).toContain('Movie 1');
    });

    it('should render search input', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('input').getAttribute('placeholder')).toContain('Search');
    });
});
