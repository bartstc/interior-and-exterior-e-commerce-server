import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions/HttpException';

export const errorMiddleware = (
  error: HttpException,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).send({
    message,
    status
  });
};
