import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GoogleCaptchaGuard } from '../google-captcha.guard';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: 'UserDataModel',
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: 'HttpService',
                    useValue: {
                        post: jest.fn().mockResolvedValue({ data: { success: true } }),
                    },
                },
                GoogleCaptchaGuard,
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
