import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import {HTTPService} from "./http.service";

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [{provide: HTTPService, useValue: {}}]});
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
