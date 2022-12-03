import {TestBed} from '@angular/core/testing';

import {ErrorInterceptor} from './error.interceptor';
import {Store} from "@ngrx/store";

describe('ErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorInterceptor,
      {provide: Store, useValue: {}}
    ]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
