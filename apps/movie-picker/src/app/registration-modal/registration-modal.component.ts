import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CaptchaService} from '../captcha.service';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'movie-picker-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.less']
})
export class RegistrationModalComponent implements AfterViewInit {
  @Input() isOpen!: boolean;
  @Output() hideModal = new EventEmitter<void>();

  registrationForm = this.formBuilder.group({
    login: '',
    password: '',
  });

  constructor(private formBuilder: FormBuilder, private captchaService: CaptchaService, private authentication: AuthenticationService) {
  }

  ngAfterViewInit() {
    this.isOpen &&
    window.app_grecaptcha.ready(() => {
      if (this.captchaService.registrationCaptchaId) {
        grecaptcha.reset(this.captchaService.registrationCaptchaId);
      } else {
        this.captchaService.registrationCaptchaId = grecaptcha.render('registration-captcha', {
          sitekey: '6LemTGUhAAAAACszBA4epVk3-9awnC_hFaKjdJhO',
        });
      }
    });
  }

  handleHideModal() {
    this.hideModal.emit();
  }

  async handleRegister() {
    const {login, password} = this.registrationForm.value;
    const captcha = window.grecaptcha.getResponse(this.captchaService.registrationCaptchaId);

    if (login && password && captcha) {
      const registrationSubject = await this.authentication.register(login, password, captcha);

      registrationSubject.subscribe({
        next: () => {
          this.registrationForm.reset();
          grecaptcha.reset(this.captchaService.loginCaptchaId);
          this.handleHideModal();
        },
        error: () => grecaptcha.reset(this.captchaService.loginCaptchaId),
      });
    }
  }
}
