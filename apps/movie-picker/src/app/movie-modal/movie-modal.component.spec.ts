import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieModalComponent } from './movie-modal.component';
import {HTTPService} from "../http.service";

describe('MovieModalComponent', () => {
  let component: MovieModalComponent;
  let fixture: ComponentFixture<MovieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieModalComponent ],
      providers: [{provide: HTTPService, useValue: {}}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
