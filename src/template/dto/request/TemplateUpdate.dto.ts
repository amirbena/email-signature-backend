import { IsOptional, IsString, MaxLength } from "class-validator";
import { MAX_TEMPLATE_NAME_LENGTH } from "src/template/templateConstants";


export class TemplateUpdate {

    @IsOptional()
    @IsString()
    @MaxLength(MAX_TEMPLATE_NAME_LENGTH)
    name?: string;

    @IsOptional()
    @IsString()
    htmlContent?: string;

    @IsOptional()
    @IsString()
    textContent?: string;

    @IsOptional()
    @IsString()
    exampleHtmlContent?: string;

    @IsOptional()
    @IsString()
    exampleTextContent?: string;
}