import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CaptchaService {
    #loginCaptchaId?: number;
    #registrationCaptchaId?: number;

    set loginCaptchaId(id: number | undefined) {
        this.#loginCaptchaId = id;
    }

    get loginCaptchaId() {
        return this.#loginCaptchaId;
    }

    set registrationCaptchaId(id: number | undefined) {
        this.#registrationCaptchaId = id;
    }

    get registrationCaptchaId() {
        return this.#registrationCaptchaId;
    }
}
