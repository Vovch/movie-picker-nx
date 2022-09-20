import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class GoogleCaptchaGuard implements CanActivate {
  private verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const { data } = await lastValueFrom(
      this.httpService.post(this.verifyUrl, null, {
        params: { response: body.captchaResponse, secret: environment.CAPTCHA },
      }),
    );

    if (!data.success) {
      throw new ForbiddenException('Captcha did not pass.');
    }

    return true;
  }
}
