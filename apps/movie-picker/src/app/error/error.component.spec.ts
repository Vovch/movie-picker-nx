import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorComponent} from './error.component';
import {Store} from "@ngrx/store";
import {of} from "rxjs";

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{provide: Store, useValue: { select: () => of([])}}],
      declarations: [ErrorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
