import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { User } from './user.entity';
import { User as IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { DataStoredInToken } from '../../types/dataStoredInToken.interface';
import { HttpException } from '../../exceptions/HttpException';
import { UserNotFoundException } from '../../exceptions/UserNotFoundException';
import { WrongCredentialsException } from '../../exceptions/WrongCredentialException';
import { EmailOrUsernameInUseException } from '../../exceptions/EmailOrUsernameInUseException';

export class AuthService {
  private userRepository = getRepository(User);

  signUp = async (userData: CreateUserDTO) => {
    const { username, email, password } = userData;
    const existingUser = await this.userRepository
      .createQueryBuilder()
      .where('username = :username OR email = :email', { username, email })
      .getMany();

    if (existingUser.length !== 0) {
      throw new EmailOrUsernameInUseException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);
    const user = { id: savedUser.id, username: savedUser.username };

    const token = this.createToken(savedUser);
    return { token, ...user };
  };

  signIn = async ({ email, password }: LoginUserDTO) => {
    const existingUser = await this.userRepository.findOne({ email });

    if (!existingUser) {
      throw new WrongCredentialsException();
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      throw new WrongCredentialsException();
    }

    const { id, username } = existingUser;
    const token = this.createToken(existingUser);
    return { token, id, username };
  };

  deleteAccount = async (id: string) => {
    const deletedUser = await this.userRepository.delete({ id });
    if (deletedUser.affected === 0) {
      throw new UserNotFoundException(id);
    }

    return deletedUser;
  };

  createToken = ({ id, username }: IUser): string => {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = { id, username };

    if (!secret) {
      throw new HttpException(500, 'Something goes wrong');
    }

    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  };
}
