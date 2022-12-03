import { TestBed } from '@angular/core/testing';

import { HTTPService } from './http.service';
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('HTTPService', () => {
  let service: HTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [{provide: HttpClient, useValue: HttpClientTestingModule}]});
    service = TestBed.inject(HTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
