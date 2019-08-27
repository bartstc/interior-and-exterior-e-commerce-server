import bodyParser from 'body-parser';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';

import { errorMiddleware } from './middlewares/error.middleware';
import { Controller } from './types/controller.interface';

const port = process.env.PORT || 5000;

export class App {
  private app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.handleProductionMode();
  }

  public listen(): void {
    this.app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }

  public getServer(): Application {
    return this.app;
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private handleProductionMode(): void {
    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static('client/build'));

      this.app.get('*', (req: Request, res: Response) => {
        res.sendFile(
          path.resolve(__dirname, '../client', 'build', 'index.html')
        );
      });
    }
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }
}
