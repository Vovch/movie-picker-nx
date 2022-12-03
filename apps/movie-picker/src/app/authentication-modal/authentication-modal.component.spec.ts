import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthenticationModalComponent} from './authentication-modal.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from "../authentication.service";
import {MoviesService} from "../movies.service";
import {ModalComponent} from "../shared/modal/modal.component";

jest.createMockFromModule('../http.service')

describe('AuthenticationModalComponent', () => {
  let component: AuthenticationModalComponent;
  let fixture: ComponentFixture<AuthenticationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        {provide: AuthenticationService, useValue: {}},
        {provide: MoviesService, useValue: {}},
        FormBuilder,
      ],
      declarations: [AuthenticationModalComponent, ModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuthenticationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
