import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../modules/auth/user.entity';
import { DataStoredInToken } from '../types/dataStoredInToken.interface';
import { WrongAuthenticationTokenException } from '../exceptions/WrongAuthenticationTokenException';
import { AuthenticationTokenMissingException } from '../exceptions/AuthenticationTokenMissingException';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = getRepository(User);
  const token = req.header('x-auth-token');

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;

      if (secret) {
        const decoded = jwt.verify(token, secret) as DataStoredInToken;
        const user = await userRepository.findOne(decoded.id);
        if (user) {
          req.user = user;
          next();
        } else {
          next(new WrongAuthenticationTokenException());
        }
      }
    } catch (e) {
      next(new WrongAuthenticationTokenException());
    }
  } else next(new AuthenticationTokenMissingException());
};
