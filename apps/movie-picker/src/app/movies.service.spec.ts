import {TestBed} from '@angular/core/testing';
import {MoviesService} from './movies.service';
import {HTTPService} from "./http.service";

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HTTPService, useValue: {}}]
    });
    service = TestBed.inject(MoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
