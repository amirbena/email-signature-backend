import { IsArray, IsBoolean, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { SelectedSignature } from "src/email-signature/emailSignatureConstants";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from "src/users/userConstants";


export class BundleEmailSignaturesCreation {

    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    userEmail: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    emailSignaturesToAdd: EmailSignatureAddition[]

}

export class EmailSignatureAddition {

    @IsNotEmpty()
    @IsMongoId()
    selectedTemplate: Types.ObjectId;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    name: string;

    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(MAX_PHONE_LENGTH)
    phone: string;

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

