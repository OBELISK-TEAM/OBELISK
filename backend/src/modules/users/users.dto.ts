import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(6, 30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30)
  @Matches(
    /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*\W){2}).*$/,
    {
      message:
        'The password must contain at least 2 special characters, 2 uppercase letters and 2 digits',
    },
  )
  password: string;
}
