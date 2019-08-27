import { IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
