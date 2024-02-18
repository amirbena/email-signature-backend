import { IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Types } from "mongoose";
import { MAX_TEMPLATE_NAME_LENGTH } from "src/template/templateConstants";


export class TemplateCreation {

    @IsNotEmpty()
    @IsString()
    @MaxLength(MAX_TEMPLATE_NAME_LENGTH)
    name: string;

    @IsNotEmpty()
    @IsString()
    htmlContent: string;

    @IsNotEmpty()
    @IsString()
    textContent: string;

    @IsNotEmpty()
    @IsString()
    exampleHtmlContent: string;

    @IsNotEmpty()
    @IsString()
    exampleTextContent: string;
}