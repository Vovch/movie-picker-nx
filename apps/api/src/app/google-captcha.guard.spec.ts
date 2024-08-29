import { GoogleCaptchaGuard } from './google-captcha.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { environment } from '../environments/environment';

describe('GoogleCaptchaGuard', () => {
  let guard: GoogleCaptchaGuard;
  let httpService: HttpService;
  const captchaSecret = process.env.CAPTCHA_SECRET || environment.CAPTCHA;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleCaptchaGuard,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<GoogleCaptchaGuard>(GoogleCaptchaGuard);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if captcha verification is successful', async () => {
      const mockRequest = {
        body: {
          captchaResponse: 'mockCaptchaResponse',
        },
      };
      const mockResponse = {
        success: true,
      };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of({ data: mockResponse } as AxiosResponse));

      const result = await guard.canActivate({ switchToHttp: () => ({ getRequest: () => mockRequest }) } as ExecutionContext);

      expect(result).toBe(true);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            response: 'mockCaptchaResponse',
            secret: captchaSecret,
          },
        },
      );
    });

    it('should throw ForbiddenException if captcha verification fails', async () => {
      const mockRequest = {
        body: {
          captchaResponse: 'mockCaptchaResponse',
        },
      };
      const mockResponse = {
        success: false,
      };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of({ data: mockResponse } as AxiosResponse));

      await expect(guard.canActivate({ switchToHttp: () => ({ getRequest: () => mockRequest }) } as ExecutionContext)).rejects.toThrowError(ForbiddenException);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            response: 'mockCaptchaResponse',
            secret: captchaSecret,
          },
        },
      );
    });
  });
});
