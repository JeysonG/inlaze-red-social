import { JwtVerifyEmailGuard } from './jwt-verify-email.guard';

describe('JwtVerifyEmailGuard', () => {
  it('should be defined', () => {
    expect(new JwtVerifyEmailGuard()).toBeDefined();
  });
});
