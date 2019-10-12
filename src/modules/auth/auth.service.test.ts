import * as typeorm from 'typeorm';
import bcrypt from 'bcryptjs';

import { fakeUser, hashedPassword } from '../../fixtures/db';
import { AuthService } from './auth.service';
import { UserNotFoundException } from '../../exceptions/UserNotFoundException';
import { WrongCredentialsException } from '../../exceptions/WrongCredentialException';
import { EmailOrUsernameInUseException } from '../../exceptions/EmailOrUsernameInUseException';

(typeorm as any).getRepository = jest.fn();

// jest.mock('bcryptjs');
// const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  const { id, username, email, password } = fakeUser;
  process.env.JWT_SECRET = 'jwt_secret';

  it('should return a string', () => {
    const authService = new AuthService();
    expect(typeof authService.createToken(fakeUser)).toBe('string');
  });

  describe('when register a user', () => {
    it('should throw an error if email or username is already taken', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          // FROM JEST DOCS: "For cases where we have methods that are typically chained (and thus always need to return this), we have a sugary API to simplify this in the form of a .mockReturnThis() function"
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValueOnce([fakeUser])
          // getMany: () => Promise.resolve([fakeUser])x
        }))
      }));

      const authService = new AuthService();
      await expect(
        authService.signUp({ username, email, password })
      ).rejects.toMatchObject(new EmailOrUsernameInUseException());
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: () => Promise.resolve([])
        })),
        create: () => fakeUser,
        save: () => Promise.resolve(fakeUser)
      }));

      const authService = new AuthService();
      await expect(
        authService.signUp({ username, email, password })
      ).resolves.toEqual(expect.objectContaining({ id, username }));
    });
  });

  describe('when login user', () => {
    it('should throw an error when user does not exist', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(undefined)
      }));

      const authService = new AuthService();
      await expect(
        authService.signIn({ email, password })
      ).rejects.toMatchObject(new WrongCredentialsException());
    });

    it('should throw an error when password does not match', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () =>
          Promise.resolve({ ...fakeUser, password: hashedPassword })
      }));

      const authService = new AuthService();
      await expect(
        authService.signIn({ email, password: 'wrongPassword' })
      ).rejects.toMatchObject(new WrongCredentialsException());
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () =>
          Promise.resolve({ ...fakeUser, password: hashedPassword })
      }));
      const mockCompare = jest.spyOn(bcrypt, 'compare');
      mockCompare.mockImplementationOnce(() => true);

      const authService = new AuthService();
      await expect(authService.signIn({ email, password })).resolves.toEqual(
        expect.objectContaining({ id, username })
      );
    });
  });

  describe('when removing account', () => {
    it('should throw an error when user does not exist', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 0 })
      }));

      const authService = new AuthService();
      await expect(authService.deleteAccount('fake-id')).rejects.toMatchObject(
        new UserNotFoundException('fake-id')
      );
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 1 })
      }));

      const authService = new AuthService();
      await expect(authService.deleteAccount(id)).resolves.toEqual({
        affected: 1
      });
    });
  });
});
