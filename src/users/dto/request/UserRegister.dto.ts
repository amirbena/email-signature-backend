import { IsEmail, IsNotEmpty, IsOptional, IsUrl, Matches, MaxLength } from "class-validator";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH, PASSWORD_LENGTH } from "src/users/userConstants";

export class UserRegisterDto {

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    name: string;

    @IsNotEmpty()
    @MaxLength(MAX_PHONE_LENGTH)
    phone: string;

    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(PASSWORD_LENGTH)
    password: string;

    @IsOptional()
    @IsUrl()
    photoUrl?: string;
}
