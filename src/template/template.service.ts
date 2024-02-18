import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CREATED_USER_KEY, NOT_FOUND_TEMPLATE_MESSAGES, UNKNOWN_ERROR_TEMPLATE_MESSAGES } from 'src/template/templateConstants';
import { TemplateCreation } from 'src/template/dto/request/TemplateCreation.dto';
import { TemplateUpdate } from 'src/template/dto/request/TemplateUpdate.dto';
import { Template, TemplateDocument } from 'src/template/template.schema';
import { Utils } from 'src/utils/Utils';
import { UsersService } from 'src/users/users.service';
import { TokenDto } from 'src/users/dto/request/TokenDto';

@Injectable()
export class TemplateService {
    constructor(@InjectModel(Template.name) private templateModel: Model<Template>, private usersService: UsersService) { }

    async createTemplate(templateToCreate: TemplateCreation, tokenDto: TokenDto): Promise<TemplateDocument> {
        try {
            Logger.log(`TemplateService->createTemplate() entered with: ${Utils.toString(templateToCreate)}, tokenDto: ${Utils.toString(tokenDto)}`);
            const { email } = tokenDto;
            const user = await this.usersService.getUserByEmail(email);
            if (!user) {
                Logger.warn(`TemplateService->createTemplate() user not found`);
                throw new NotFoundException(NOT_FOUND_TEMPLATE_MESSAGES.USER_NOT_FOUND);
            }
            const template = new this.templateModel({ ...templateToCreate, user: user._id });
            await template.save();
            Logger.log(`TemplateService->createTemplate got: ${Utils.toString(template)}`);
            return template.populate(CREATED_USER_KEY);
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`TemplateService->createTemplate() an undefined error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_TEMPLATE_MESSAGES.CREATION);
        }

    }

    async getTemplate(templateId: Types.ObjectId): Promise<TemplateDocument> {
        try {
            Logger.log(`TemplateService->getTemplate() entered with: ${Utils.toString(templateId)}`);
            const template = await this.templateModel.findById(templateId).populate(CREATED_USER_KEY);
            if (!template) {
                Logger.warn(`TemplateService->getTemplate() template not found`);
                throw new NotFoundException(NOT_FOUND_TEMPLATE_MESSAGES.TEMPLATE_NOT_FOUND);
            }
            Logger.log(`TemplateService->createTemplate got: ${Utils.toString(template)}`);
            return template;
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`TemplateService->getTemplate() an undefined error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_TEMPLATE_MESSAGES.GET);
        }

    }

    async updateTemplate(templateId: Types.ObjectId, templateToUpdate: TemplateUpdate): Promise<TemplateDocument> {
        try {
            Logger.log(`TemplateService->getTemplate() entered with: ${Utils.toString(templateId)}, ${Utils.toString(templateToUpdate)}`);
            const { } = templateToUpdate;
            const template = await this.templateModel.findByIdAndUpdate(templateId, templateToUpdate).populate(CREATED_USER_KEY);
            if (!template) {
                Logger.warn(`TemplateService->getTemplate() template not found`);
                throw new NotFoundException(NOT_FOUND_TEMPLATE_MESSAGES.TEMPLATE_NOT_FOUND);
            }
            Logger.log(`TemplateService->createTemplate got: ${Utils.toString(template)}`);
            return template;
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`TemplateService->getTemplate() an undefined error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_TEMPLATE_MESSAGES.UPDATE);
        }

    }

    async deleteTemplate(templateId: Types.ObjectId): Promise<TemplateDocument> {
        try {
            Logger.log(`TemplateService->getTemplate() entered with: ${Utils.toString(templateId)}`);
            const template = await this.templateModel.findByIdAndDelete(templateId);
            if (!template) {
                Logger.warn(`TemplateService->getTemplate() template not found`);
                throw new NotFoundException(NOT_FOUND_TEMPLATE_MESSAGES.TEMPLATE_NOT_FOUND);
            }
            Logger.log(`TemplateService->createTemplate got: ${Utils.toString(template)}`);
            return template;
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`TemplateService->getTemplate() an undefined error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_TEMPLATE_MESSAGES.DELETE);
        }

    }

    async getAllTemplates(): Promise<TemplateDocument[]> {
        try {
            const templates = await this.templateModel.find({}).populate(CREATED_USER_KEY);
            return templates;
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`TemplateService->getTemplate() an undefined error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_TEMPLATE_MESSAGES.GET_ALL);
        }

    }
}
