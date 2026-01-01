import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CaptchaService } from '../captcha.service';
import { AuthenticationService } from '../authentication.service';
import { MoviesService } from '../movies.service';

@Component({
    selector: 'movie-picker-authentication-modal',
    templateUrl: './authentication-modal.component.html',
    styleUrls: ['./authentication-modal.component.less'],
})
export class AuthenticationModalComponent {
    @Input() isOpen!: boolean;
    @Output() hideModal = new EventEmitter<void>();
    isError = false;

    loginForm = this.formBuilder.group({
        login: '',
        password: '',
    });

    constructor(
        private formBuilder: FormBuilder,
        private captchaService: CaptchaService,
        private auth: AuthenticationService,
        private moviesService: MoviesService,
    ) {}

    handleHideModal() {
        this.hideModal.emit();
        this.isError = false;
    }

    async handleLogin() {
        const { login, password } = this.loginForm.value;

        if (login && password) {
            const loginSubject = await this.auth.login(login, password);

            loginSubject.subscribe({
                next: (lists) => {
                    this.loginForm.reset({ login: '', password: '' }); // Ensure the form is reset here
                    this.handleHideModal();
                    this.moviesService.changeUserLists(lists);
                },
                error: (e) => {
                    console.log(e);
                    this.isError = true;
                },
            });
        } else {
            this.isError = true;
        }
    }
}
