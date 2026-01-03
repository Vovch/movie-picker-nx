import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {HTTPService} from "./http.service";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import { MoviesService } from './movies.service';
import { AuthenticationService } from './authentication.service';
import { IMovie } from '@movie-picker/api-interfaces';

describe('AppComponent', () => {
  let httpService: HTTPService;
  let auth: AuthenticationService;
  let moviesService: MoviesService;
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [{
        provide: HTTPService,
        useValue: {
          getMovies: jest.fn().mockReturnValue(of([])),
          cacheMoviesList: jest.fn(),
          getCachedMovies: jest.fn().mockResolvedValue(null),
        }
      }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    httpService = TestBed.inject(HTTPService);
    auth = TestBed.inject(AuthenticationService);
    moviesService = TestBed.inject(MoviesService);
    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toMatchSnapshot();
  });

  it('should fetch user lists when user is authenticated', () => {
    jest.spyOn(auth, 'getAuthInfo').mockReturnValue({ login: 'test', hash: 'test' });
    jest.spyOn(moviesService, 'fetchUserLists').mockImplementation();

    appComponent.ngOnInit();

    expect(moviesService.fetchUserLists).toHaveBeenCalledWith('test', 'test');
  });

  it('should not fetch user lists when user is not authenticated', () => {
    jest.spyOn(auth, 'getAuthInfo').mockReturnValue({ login: null, hash: null });
    jest.spyOn(moviesService, 'fetchUserLists').mockImplementation();

    appComponent.ngOnInit();

    expect(moviesService.fetchUserLists).not.toHaveBeenCalled();
  });

  it('should change movies list when HTTP request is successful', () => {
    const mockMovies: IMovie[] = [
      {
        id: 1,
        name: 'Movie 1',
        originalName: 'Original Movie 1',
        director: 'Director 1',
        yearProduced: '2001',
        yearAdded: '2002',
        durationMinutes: 101
      },
      {
        id: 2,
        name: 'Movie 2',
        originalName: 'Original Movie 2',
        director: 'Director 2',
        yearProduced: '2003',
        yearAdded: '2004',
        durationMinutes: 102
      },
      {
        id: 3,
        name: 'Movie 3',
        originalName: 'Original Movie 3',
        director: 'Director 3',
        yearProduced: '2005',
        yearAdded: '2006',
        durationMinutes: 103
      },
    ];

    jest.spyOn(httpService, 'getMovies').mockReturnValue(of({ list: mockMovies, listId: '', name: '' }));
    jest.spyOn(moviesService, 'changeMoviesList').mockImplementation();

    appComponent.ngOnInit();

    expect(moviesService.changeMoviesList).toHaveBeenCalledWith({ list: mockMovies, listId: '', name: '' });
  });
});
