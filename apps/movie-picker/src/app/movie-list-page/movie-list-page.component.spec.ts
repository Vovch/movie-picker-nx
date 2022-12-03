import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovieListPageComponent} from './movie-list-page.component';
import {MoviesService} from "../movies.service";
import {HTTPService} from "../http.service";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('MovieListPageComponent', () => {
  let component: MovieListPageComponent;
  let fixture: ComponentFixture<MovieListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieListPageComponent],
      providers: [{provide: MoviesService, useValue: {movies$: of([]), userLists$: of([])}}, {provide: HTTPService, useValue: {}}],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovieListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
