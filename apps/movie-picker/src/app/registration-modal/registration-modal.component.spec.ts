import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationModalComponent} from './registration-modal.component';
import {FormBuilder} from "@angular/forms";
import {HTTPService} from "../http.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('RegistrationModalComponent', () => {
  let component: RegistrationModalComponent;
  let fixture: ComponentFixture<RegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationModalComponent],
      providers: [FormBuilder, {provide: HTTPService, useValue: {}}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
