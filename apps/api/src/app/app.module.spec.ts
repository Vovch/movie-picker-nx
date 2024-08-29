import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

// Mock MongoDB connection
jest.mock('@nestjs/mongoose', () => ({
  MongooseModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class {},
      providers: [],
    }),
  },
}));

// Mock other modules
jest.mock('./users/users.module', () => ({
  UsersModule: class {},
}));

jest.mock('./movies/movies.module', () => ({
  MoviesModule: class {},
}));

jest.mock('./auth/auth.module', () => ({
  AuthModule: class {},
}));

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should have AppModule defined', () => {
    const appModule = app.get(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should have MongooseModule imported', () => {
    expect(MongooseModule.forRoot).toHaveBeenCalled();
  });

  it('should have UsersModule imported', () => {
    expect(() => app.get(UsersModule)).not.toThrow();
  });

  it('should have MoviesModule imported', () => {
    expect(() => app.get(MoviesModule)).not.toThrow();
  });

  it('should have AuthModule imported', () => {
    expect(() => app.get(AuthModule)).not.toThrow();
  });
});