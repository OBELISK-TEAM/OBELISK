import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'The email is invalid',
    },
  )
  @IsNotEmpty({
    message: 'The email is required',
  })
  @Length(6, 30, {
    message: 'The email must be at least 6 but not longer than 30 characters',
  })
  email: string;

  @IsString({
    message: 'The password must be a string',
  })
  @IsNotEmpty({
    message: 'The password is required',
  })
  @Length(8, 30, {
    message:
      'The password must be at least 8 but not longer than 30 characters',
  })
  @Matches(
    /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*\W){2}).*$/,
    {
      message:
        'The password must contain at least 2 special characters, 2 uppercase letters and 2 digits',
    },
  )
  password: string;
}