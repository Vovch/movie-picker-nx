import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { CaptchaService } from '../captcha.service';
import { AuthenticationService } from '../authentication.service';
import { MoviesService } from '../movies.service';
import { AuthenticationModalComponent } from './authentication-modal.component';

describe('AuthenticationModalComponent', () => {
  let component: AuthenticationModalComponent;
  let fixture: ComponentFixture<AuthenticationModalComponent>;
  let formBuilder: FormBuilder;
  let captchaService: CaptchaService;
  let authService: AuthenticationService;
  let moviesService: MoviesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationModalComponent ],
      providers: [
        FormBuilder,
        { provide: CaptchaService, useValue: {} },
        { provide: AuthenticationService, useValue: {} },
        { provide: MoviesService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationModalComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    captchaService = TestBed.inject(CaptchaService);
    authService = TestBed.inject(AuthenticationService);
    moviesService = TestBed.inject(MoviesService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the loginForm with empty values', () => {
    expect(component.loginForm.value.login).toBe('');
    expect(component.loginForm.value.password).toBe('');
  });

  it('should emit hideModal event when handleHideModal is called', () => {
    const hideModalEventSpy = jest.spyOn(component.hideModal, 'emit');
    component.handleHideModal();
    expect(hideModalEventSpy).toHaveBeenCalled();
  });

  it('should reset the form and emit hideModal event on successful login', async () => {
    const mockLoginSubject = { subscribe: jest.fn() };
    authService.login = jest.fn().mockReturnValue(mockLoginSubject);

    component.loginForm.setValue({ login: 'testuser', password: 'password' });
    await component.handleLogin();

    expect(component.loginForm.value.login).toBe('');
    expect(component.loginForm.value.password).toBe('');
    expect(mockLoginSubject.subscribe).toHaveBeenCalledWith({
      next: () => {
        expect(component.hideModal.emit).toHaveBeenCalled();
      }
    });
  });

  it('should set isError to true on login failure', async () => {
    const mockError = new Error('Login failed');
    const mockLoginSubject = { subscribe: jest.fn().mockImplementationOnce((subscriber) => {
      subscriber.error(mockError);
    }) };
    authService.login = jest.fn().mockReturnValue(mockLoginSubject);

    component.loginForm.setValue({ login: 'testuser', password: 'password' });
    await component.handleLogin();

    expect(component.isError).toBe(true);
  });

  it('should set isError to true if login form values are empty', async () => {
    component.loginForm.setValue({ login: '', password: '' });
    await component.handleLogin();

    expect(component.isError).toBe(true);
  });

  it('should reset isError flag when handleHideModal is called', () => {
    component.isError = true;
    component.handleHideModal();
    expect(component.isError).toBe(false);
  });
});
