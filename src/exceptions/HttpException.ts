export class HttpException extends Error {
  constructor(public status: number, public message: string) {
    super(message); // call parent constructor and pass message
  }
}
