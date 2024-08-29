import { Test } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
