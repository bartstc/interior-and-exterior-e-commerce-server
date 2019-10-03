import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../modules/auth/user.entity';
import { DataStoredInToken } from '../types/dataStoredInToken.interface';
import { WrongAuthenticationTokenException } from '../exceptions/WrongAuthenticationTokenException';
import { AuthenticationTokenMissingException } from '../exceptions/AuthenticationTokenMissingException';
import { HttpException } from '../exceptions/HttpException';

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const userRepository = getRepository(User);
  const secret = process.env.JWT_SECRET;
  const token = req.header('x-auth-token');

  if (!secret) {
    next(new HttpException(500, 'Internal server error'));
    return;
  }

  if (!token) {
    next(new AuthenticationTokenMissingException());
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as DataStoredInToken;
    const user = await userRepository.findOne(decoded.id);

    if (!user) {
      next(new WrongAuthenticationTokenException());
      return;
    }

    req.user = user;
    next();
  } catch (e) {
    next(new WrongAuthenticationTokenException());
  }
};
