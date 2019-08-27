import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Request } from 'express';

import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { DataStoredInToken } from '../../types/dataStoredInToken.interface';
import { TokenData } from '../../types/tokenData.interface';
import { EmailOrUsernameInUseException } from '../../exceptions/EmailOrUsernameInUseException';
import { WrongCredentialsException } from '../../exceptions/WrongCredentialException';
import { HttpException } from '../../exceptions/HttpException';
import { UserNotFoundException } from '../../exceptions/UserNotFoundException';

export class AuthService {
  private userRepository = getRepository(User);

  signUp = async (userData: CreateUserDTO) => {
    const existingUser = await this.userRepository
      .createQueryBuilder()
      .where('username = :username OR email = :email', {
        username: userData.username,
        email: userData.email
      })
      .getMany();

    if (existingUser.length !== 0) throw new EmailOrUsernameInUseException();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);
    const user = { id: savedUser.id, username: savedUser.username };

    const { token } = this.createToken(savedUser);
    return { token, ...user };
  };

  signIn = async (loginData: LoginUserDTO) => {
    const existingUser = await this.userRepository.findOne({
      email: loginData.email
    });
    if (existingUser) {
      const isMatch = await bcrypt.compare(
        loginData.password,
        existingUser.password
      );
      if (isMatch) {
        const user = { id: existingUser.id, username: existingUser.username };

        const { token } = this.createToken(existingUser);
        return { token, ...user };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  };

  deleteAccount = async (req: Request) => {
    const user: User = req.user;

    const deletedUser = await this.userRepository.delete({ id: user.id });
    if (deletedUser.affected === 0) throw new UserNotFoundException(user.id);
  };

  createToken = (user: User): TokenData => {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id
    };

    if (secret) {
      const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
      return { token };
    } else throw new HttpException(500, 'Something goes wrong');
  };
}
