import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username!: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
      message: 'Password too weak'
    }
  )
  password!: string;
}
