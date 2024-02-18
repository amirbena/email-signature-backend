import { IsBoolean, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { Types } from "mongoose";
import { SelectedSignature } from "src/email-signature/emailSignatureConstants";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from "src/users/userConstants";


export class EmailSignatureCreation {

    @IsNotEmpty()
    @IsMongoId()
    selectedTemplate: Types.ObjectId;

    @IsOptional()
    @MaxLength(MAX_NAME_LENGTH)
    name?: string;

    @IsOptional()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email?: string;

    @IsOptional()
    @MaxLength(MAX_PHONE_LENGTH)
    phone?: string;

    @IsNotEmpty()
    @IsEnum(SelectedSignature)
    selectedSignature: SelectedSignature;

    @IsOptional()
    @IsUrl()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    htmlContent?: string;

    @IsOptional()
    @IsString()
    textContent?: string;

}