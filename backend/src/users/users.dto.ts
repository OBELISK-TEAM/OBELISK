import {
  IsEmail,
  IsNotEmpty,
  IsString,
  // Length,
  // Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  // @Length(6, 30)
  email: string;

  @IsString()
  @IsNotEmpty()
  // @Length(8, 30)
  // @Matches(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
  //   message:
  //     'Password must have at least 8 characters, 2 uppercase letters, and 2 special characters.',
  // })
  password: string;
}
