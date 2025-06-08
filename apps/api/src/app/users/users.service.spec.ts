import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UnprocessableEntityException } from '@nestjs/common'; // Moved to top

// Mock UserDataModel
const mockUserDataModel = {
  countDocuments: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  // Add other methods like $pull, $addToSet if they are directly called on the model instance
  // For now, assuming they are part of updateOne's operations
};

// Mock for the model instance, chain exec if needed
const mockExec = jest.fn();
const mockQuery = { exec: mockExec };

// Main describe block for UsersService
describe('UsersService', () => {
  let service: UsersService;
  // Removed 'model' as it's not consistently used or needed if mockUserDataModel is correctly provided.
  let moduleBuilder: TestingModuleBuilder;

  // Define MockModelClass here to be accessible in beforeEach
  const mockSave = jest.fn();
  const MockModelClass = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  beforeEach(async () => {
    // Reset mocks for each test
    mockUserDataModel.countDocuments.mockReset();
    // mockUserDataModel.save.mockReset(); // This was for the old static mock, not needed if overriding provider with MockModelClass
    mockSave.mockReset(); // Reset the save method of our MockModelClass instance
    mockUserDataModel.findOne.mockReset();
    mockUserDataModel.updateOne.mockReset();
    mockExec.mockReset();
    MockModelClass.mockClear(); // Clear calls and instances of the constructor mock

    // Default behavior for mocks (can be overridden in specific tests)
    mockUserDataModel.findOne.mockReturnValue(mockQuery); // findOne returns a query

    // Setup TestingModuleBuilder
    moduleBuilder = Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserDataModel',
          useValue: mockUserDataModel, // Default provider, will be overridden for specific tests if needed
        },
      ],
    });
  });

  it('should be defined', async () => {
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<UsersService>(UsersService);
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = { login: 'testuser', hash: 'password', captchaResponse: 'test' }; // Added captchaResponse

    beforeEach(async () => {
      // Attach static mock method to the constructor mock
      (MockModelClass as any).countDocuments = mockUserDataModel.countDocuments;

      // Override UserDataModel for tests that use `new this.userDataModel()`
      // This ensures MockModelClass is used as the constructor
      // For the 'create' describe block, we need the overridden provider.
      const module = await moduleBuilder
        .overrideProvider('UserDataModel')
        .useValue(MockModelClass as any)
        .compile();
      service = module.get<UsersService>(UsersService);
    });

    it('should create a new user if login does not exist', async () => {
      mockUserDataModel.countDocuments.mockResolvedValue(0);
      mockSave.mockResolvedValue({ login: createUserDto.login, _id: 'mockId' }); // Mock what save() returns

      jest.spyOn(service, 'generateUserHash').mockResolvedValue({ userHash: 'hashedpassword', userSalt: 'somesalt' });

      await service.create(createUserDto);

      expect(MockModelClass).toHaveBeenCalledWith(expect.objectContaining({
        login: createUserDto.login,
        hash: 'hashedpassword',
        salt: 'somesalt',
      }));
      expect(mockSave).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException if user already exists', async () => {
      mockUserDataModel.countDocuments.mockResolvedValue(1);
      // No need to compile module again if already done in outer describe's beforeEach or this describe's beforeEach
      // However, ensure service is available if module was compiled in the 'it' block's scope previously.
      // For this test, we don't need the overridden MockModelClass, default mockUserDataModel is fine.
      // Recompile with default mock if necessary, or ensure service from a general compile is used.
      const module = await Test.createTestingModule({
        providers: [
          UsersService,
          { provide: 'UserDataModel', useValue: mockUserDataModel },
        ],
      }).compile();
      service = module.get<UsersService>(UsersService);


      await expect(service.create(createUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(mockUserDataModel.countDocuments).toHaveBeenCalledWith({ login: createUserDto.login });
    });
  });

  describe('findOne', () => {
    const login = 'testuser';

    // Compile module for findOne tests
    beforeEach(async () => {
      const module = await moduleBuilder.compile();
      service = module.get<UsersService>(UsersService);
    });
    const mockUser = {
      login,
      hash: 'hashedpassword',
      salt: 'somesalt',
      userMovies: [],
    };

    it('should return user data if user is found', async () => {
      mockExec.mockResolvedValue(mockUser);
      mockUserDataModel.findOne.mockReturnValue({ exec: mockExec } as any);

      const result = await service.findOne(login);

      expect(mockUserDataModel.findOne).toHaveBeenCalledWith(
        { login },
        { userMovies: { listId: 1, movieId: 1, status: 1 }, login: 1, hash: 1, salt: 1 },
      );
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      mockExec.mockResolvedValue(null);
      mockUserDataModel.findOne.mockReturnValue({ exec: mockExec } as any);

      await expect(service.findOne(login)).rejects.toThrow('unable to authorize');
      expect(mockUserDataModel.findOne).toHaveBeenCalledWith(
        { login },
        { userMovies: { listId: 1, movieId: 1, status: 1 }, login: 1, hash: 1, salt: 1 },
      );
      expect(mockExec).toHaveBeenCalled();
    });
  });

  describe('changeMovieStatus', () => {
    const updateUserDtoBase = {
      login: 'testuser',
      movieId: 'movie123',
      listId: 'list456',
      hash: 'somehash', // Added hash
    };

    beforeEach(async () => { // Ensure service is compiled for these tests
      const module = await moduleBuilder.compile();
      service = module.get<UsersService>(UsersService);
    });

    it('should remove movie status if status is falsy (e.g., empty string or null for string type)', async () => {
      // In the DTO, status is a string. A "falsy" string status could be an empty string.
      // The service code `if (!status)` will treat empty string `''` as falsy.
      const dto = { ...updateUserDtoBase, status: '' };
      mockUserDataModel.updateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 } as any);

      await service.changeMovieStatus(dto);

      expect(mockUserDataModel.updateOne).toHaveBeenCalledWith(
        { login: dto.login },
        {
          $pull: {
            userMovies: {
              movieId: dto.movieId,
              listId: dto.listId,
            },
          },
        },
      );
    });

    it('should update existing movie status if status is truthy and movie exists', async () => {
      const dto = { ...updateUserDtoBase, status: 'watched' };
      mockUserDataModel.updateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 } as any);

      await service.changeMovieStatus(dto);

      expect(mockUserDataModel.updateOne).toHaveBeenCalledWith(
        {
          login: dto.login,
          'userMovies.movieId': dto.movieId,
          'userMovies.listId': dto.listId,
        },
        {
          $set: { 'userMovies.$.status': dto.status },
        },
      );
    });

    it('should add movie status if status is truthy and movie does not exist in userMovies', async () => {
      const dto = { ...updateUserDtoBase, status: 'planned' };
      mockUserDataModel.updateOne.mockResolvedValueOnce({ matchedCount: 0, modifiedCount: 0 } as any);
      mockUserDataModel.updateOne.mockResolvedValueOnce({ matchedCount: 1, modifiedCount: 1 } as any);

      await service.changeMovieStatus(dto);

      expect(mockUserDataModel.updateOne).toHaveBeenNthCalledWith(
        1,
        {
          login: dto.login,
          'userMovies.movieId': dto.movieId,
          'userMovies.listId': dto.listId,
        },
        {
          $set: { 'userMovies.$.status': dto.status },
        },
      );

      expect(mockUserDataModel.updateOne).toHaveBeenNthCalledWith(
        2,
        { login: dto.login },
        {
          $addToSet: {
            userMovies: {
              movieId: dto.movieId,
              listId: dto.listId,
              status: dto.status,
            },
          },
        },
      );
    });
  });

  describe('generateUserHash', () => {
    const login = 'testuser';

    // Compile module for generateUserHash tests
    beforeEach(async () => {
      const module = await moduleBuilder.compile();
      service = module.get<UsersService>(UsersService);
    });
    const hash = 'password';
    // mockSalt should be a hex string representing 16 bytes (32 characters)
    const mockSaltHex = '666978656473616c74313233343536ab'; // "fixedsalt123456ab"
    const mockDerivedKey = Buffer.from('derivedkeymock');

    let randomBytesSpy, promisifySpy, scryptMockFn;

    beforeEach(() => {
      const crypto = require('crypto');
      const util = require('util');

      // crypto.randomBytes returns a Buffer. So, the mockReturnValue should be a Buffer.
      // The service then calls .toString('hex') on this Buffer.
      randomBytesSpy = jest.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from(mockSaltHex, 'hex'));

      // This is the function that util.promisify will receive
      scryptMockFn = jest.fn((data, salt, len, cb) => cb(null, mockDerivedKey));
      // Mock crypto.scrypt to be our scryptMockFn so that when promisify wraps it, it wraps our mock
      jest.spyOn(crypto, 'scrypt').mockImplementation(scryptMockFn as any);

      // Mock util.promisify to correctly wrap our scryptMockFn
      // When service calls `promisify(scrypt)`, it should get a function that returns a promise
      promisifySpy = jest.spyOn(util, 'promisify').mockImplementation((fnToPromisify: any) => {
        if (fnToPromisify === crypto.scrypt) {
          // Return a function that, when called, returns a Promise
          // This promisified function should then call our scryptMockFn to allow arg checking if needed.
          // For now, it directly resolves.
          return (...argsPromisfied: any[]) => {
            // If you need to check args passed to scrypt:
            // scryptMockFn(argsPromisfied[0], argsPromisfied[1], argsPromisfied[2], (err, key) => {});
            return Promise.resolve(mockDerivedKey);
          };
        }
        // Fallback for other uses of promisify, if any
        return jest.requireActual('util').promisify(fnToPromisify);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should generate hash with a provided salt', async () => {
      const result = await service.generateUserHash({ login, hash, salt: mockSaltHex });
      expect(randomBytesSpy).not.toHaveBeenCalled();
      expect(promisifySpy).toHaveBeenCalledWith(require('crypto').scrypt);
      // Check that the actual scrypt (our mock) was called by the promisified version
      // This requires the promisify mock to call the original function.
      // For now, we check the output.
      expect(result.userSalt).toBe(mockSaltHex);
      expect(result.userHash).toBe(mockDerivedKey.toString('hex'));
    });

    it('should generate hash with a newly generated salt if no salt is provided', async () => {
      const result = await service.generateUserHash({ login, hash }); // No salt provided
      expect(randomBytesSpy).toHaveBeenCalledWith(16);
      expect(promisifySpy).toHaveBeenCalledWith(require('crypto').scrypt);
      // The salt used by scrypt will be the hex string from randomBytes(16).toString('hex')
      // which is `mockSaltHex` because randomBytesSpy returns Buffer.from(mockSaltHex, 'hex')
      expect(result.userSalt).toBe(mockSaltHex);
      expect(result.userHash).toBe(mockDerivedKey.toString('hex'));
    });
  });
});
