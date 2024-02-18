import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Routes, TEMPLATE_ID_PARAM } from 'src/constants/routes.constants';
import { TemplateService } from './template.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TemplateCreation } from 'src/template/dto/request/TemplateCreation.dto';
import { Types } from 'mongoose';
import { TemplateUpdate } from 'src/template/dto/request/TemplateUpdate.dto';
import { TemplateDocument } from 'src/template/template.schema';
import { USER_TOKEN_PAYLOAD } from 'src/constants/constants';
import { TokenDto } from 'src/users/dto/request/TokenDto';

@Controller(Routes.Templates)
export class TemplateController {
    constructor(private templateService: TemplateService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async createTemplate(@Body() templateCreation: TemplateCreation, @Body(USER_TOKEN_PAYLOAD) tokenDto: TokenDto): Promise<TemplateDocument> {
        const templateCreated = await this.templateService.createTemplate(templateCreation, tokenDto);
        return templateCreated;
    }

    @Get(`/:${TEMPLATE_ID_PARAM}`)
    @UseGuards(AuthGuard)
    async getTemplate(@Param(TEMPLATE_ID_PARAM) templateId: Types.ObjectId): Promise<TemplateDocument> {
        const template = await this.templateService.getTemplate(templateId);
        return template;
    }

    @Put(`/:${TEMPLATE_ID_PARAM}`)
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async updateTemplate(@Param(TEMPLATE_ID_PARAM) templateId: Types.ObjectId, @Body() templateToUpdate: TemplateUpdate): Promise<TemplateDocument> {
        const updatedTemplate = await this.templateService.updateTemplate(templateId, templateToUpdate);
        return updatedTemplate;
    }

    @Delete(`/:${TEMPLATE_ID_PARAM}`)
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async deleteTemplate(@Param(TEMPLATE_ID_PARAM) templateId: Types.ObjectId): Promise<TemplateDocument> {
        const deletedTemplate = await this.templateService.deleteTemplate(templateId);
        return deletedTemplate;
    }

    @Get()
    @UseGuards(AuthGuard)
    async getAllTemplates(): Promise<TemplateDocument[]> {
        const template = await this.templateService.getAllTemplates();
        return template;
    }


}
