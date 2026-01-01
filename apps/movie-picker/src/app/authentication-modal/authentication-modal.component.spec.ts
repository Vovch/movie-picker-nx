import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CaptchaService } from '../captcha.service';
import { AuthenticationService } from '../authentication.service';
import { MoviesService } from '../movies.service';
import { ModalComponent } from '../shared/modal/modal.component';
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
            imports: [CommonModule, ReactiveFormsModule],
            declarations: [AuthenticationModalComponent, ModalComponent],
            providers: [
                FormBuilder,
                { provide: CaptchaService, useValue: {} },
                { provide: AuthenticationService, useValue: { login: jest.fn() } },
                { provide: MoviesService, useValue: { changeUserLists: jest.fn() } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthenticationModalComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        captchaService = TestBed.inject(CaptchaService);
        authService = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>;
        moviesService = TestBed.inject(MoviesService) as jest.Mocked<MoviesService>;

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
        const mockLists = ['my list'];
        const hideModalSpy = jest.spyOn(component.hideModal, 'emit');
        const mockLoginSubject = {
            subscribe: jest.fn(({ next }) => next(mockLists)),
        };
        authService.login = jest.fn().mockReturnValue(mockLoginSubject as any);

        component.loginForm.setValue({ login: 'testuser', password: 'password' });
        await component.handleLogin();

        expect(mockLoginSubject.subscribe).toHaveBeenCalled();
        expect(component.loginForm.value.login).toBe('');
        expect(component.loginForm.value.password).toBe('');
        expect(hideModalSpy).toHaveBeenCalled();
        expect(moviesService.changeUserLists).toHaveBeenCalledWith(mockLists);
    });

    it('should set isError to true on login failure', async () => {
        const mockError = new Error('Login failed');
        const mockLoginSubject = {
            subscribe: jest.fn().mockImplementationOnce((subscriber) => {
                subscriber.error(mockError);
            }),
        };
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
