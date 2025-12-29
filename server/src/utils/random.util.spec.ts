import crypto from 'crypto';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

import { RandomUtil } from './random.util';

const mockedRandomBytes = crypto.randomBytes as jest.MockedFunction<typeof crypto.randomBytes>;

describe('RandomUtil', () => {
  afterEach(() => {
    mockedRandomBytes.mockReset();
  });

  it('generates activation keys using crypto bytes', () => {
    mockedRandomBytes.mockImplementationOnce(() => Buffer.from('00112233445566778899', 'hex'));

    const key = RandomUtil.generateActivationKey();

    expect(mockedRandomBytes).toHaveBeenCalledWith(10);
    expect(key).toBe('00112233445566778899');
  });

  it('generates reset keys using crypto bytes', () => {
    mockedRandomBytes.mockImplementationOnce(() => Buffer.from('aabbccddeeff00112233', 'hex'));

    const key = RandomUtil.generateResetKey();

    expect(mockedRandomBytes).toHaveBeenCalledWith(10);
    expect(key).toBe('aabbccddeeff00112233');
  });

  it('creates passwords that respect the charset mapping', () => {
    const sequentialBytes = Buffer.from(Array.from({ length: 16 }, (_, idx) => idx));
    mockedRandomBytes.mockImplementationOnce(() => sequentialBytes);

    const password = RandomUtil.generatePassword();

    expect(mockedRandomBytes).toHaveBeenCalledWith(16);
    expect(password).toHaveLength(16);
    expect(password).toBe('abcdefghijklmnop');
  });
});
