import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  // Mock UserDataModel
  const mockUserDataModel = {
    // Add mock methods and properties here
  };

  // Mock HttpService
  const mockHttpService = {
    // Add mock methods like get, post, etc. if needed by GoogleCaptchaGuard
    // For example:
    // get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'UserDataModel', // Or use the actual UserDataModel class
          useValue: mockUserDataModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
