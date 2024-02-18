import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TokenDto } from 'src/users/dto/request/TokenDto';
import { EmailSignatureCreation } from 'src/email-signature/dto/request/EmailSignatureCreation.dto';
import { EmailSignature } from 'src/email-signature/email-signature.schema';
import { TemplateService } from 'src/template/template.service';
import { UsersService } from 'src/users/users.service';
import { Utils } from 'src/utils/Utils';
import { CREATED_TEMPLATE_KEY, NOT_FOUND_EMAIL_SIGNATURE_ERRORS, SelectedSignature, UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES } from './emailSignatureConstants';
import { EmailSignatureResult } from 'src/email-signature/dto/response/EmailSignatureResult.dto';
import { SignatureRender } from './model/SignatureRender';
import * as nunjunks from 'nunjucks';
import { TemplateDocument } from 'src/template/template.schema';
import { EmailSignatureUpdate } from './dto/request/EmailSignatureUpdate.dto';
import { BundleEmailSignaturesCreation, EmailSignatureAddition } from './dto/request/BundleEmailSignatureAddition.dto';
import { UserDocument } from 'src/users/users.schema';

@Injectable()
export class EmailSignatureService {

    constructor(@InjectModel(EmailSignature.name) private emailSignatureModel: Model<EmailSignature>, private userService: UsersService, private templateService: TemplateService) { }

    async createEmailSignature(emailSignatureCreation: EmailSignatureCreation, tokenDto: TokenDto): Promise<EmailSignatureResult> {
        Logger.log(`EmailSignatureService>createEmailSignature() entered with: ${Utils.toString(emailSignatureCreation)}, tokenDto: ${tokenDto}`);
        try {
            const { selectedTemplate } = emailSignatureCreation;
            const { email } = tokenDto;

            const user = await this.userService.getUserByEmail(email);
            const template = await this.templateService.getTemplate(selectedTemplate);

            if (!user || !template) {
                Logger.warn(`EmailSignatureService->createEmailSignature() has not user- can't continue`);
                throw new NotFoundException(NOT_FOUND_EMAIL_SIGNATURE_ERRORS.USER);
            }

            const signatureRender: SignatureRender = {
                email: emailSignatureCreation.email ?? user.email,
                name: emailSignatureCreation.name ?? user.name,
                photoUrl: emailSignatureCreation.photoUrl ?? user.photoUrl,
                phone: emailSignatureCreation.phone ?? user.phone,
            }

            const creationModel: EmailSignature = {
                ...signatureRender,
                createdUser: user._id,
                htmlContent: this.buildSignatureContent(template, signatureRender, SelectedSignature.HTML),
                selectedTemplate: template._id,
                textContent: this.buildSignatureContent(template, signatureRender, SelectedSignature.TEXT),
                selectedSignature: emailSignatureCreation.selectedSignature
            }

            const emailSignature = new this.emailSignatureModel(creationModel);
            await emailSignature.save();

            Logger.log(`EmailSignatureService->createEmailSignature() saved as: ${Utils.toString(emailSignature)}`);
            const emailSignatureResult = Utils.buildEmailSignatureResultFromEmailSignature(emailSignature);
            Logger.log(`EmailSignatureService>createEmailSignature() got: ${Utils.toString(emailSignatureResult)}`);
            return emailSignatureResult;

        } catch (error) {
            console.log(error);
            if (error.status) throw error;
            Logger.error(`EmailSignatureService->createEmailSignature() an error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES.CREATION);
        }
    }


    async getAllSignaturesByUser(tokenDto: TokenDto) {
        Logger.log(`EmailSignatureService->getAllSignaturesByUser() entered with ${Utils.toString(tokenDto)}`);
        try {
            const { email } = tokenDto;
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new NotFoundException(NOT_FOUND_EMAIL_SIGNATURE_ERRORS.USER);
            }
            const emailSignatures = await this.emailSignatureModel.find({ createdUser: user._id });
            return emailSignatures.map(emailSignature => Utils.buildEmailSignatureResultFromEmailSignature(emailSignature));
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`EmailSignatureService->createEmailSignature() an error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES.GET_ALL);
        }
    }


    async updateSignatureOfUser(emailSignatureId: Types.ObjectId, tokenDto: TokenDto, updateSignatureUser: EmailSignatureUpdate) {
        Logger.log(`EmailSignatureService->updateSignatureOfUser() entered with: ${Utils.toString(tokenDto)}, updateSignatureUser: ${Utils.toString(updateSignatureUser)}`);
        try {

            const emailSignature = await this.emailSignatureModel.findById(emailSignatureId);
            if (!emailSignature) {
                Logger.warn(`EmailSignatureService->updateSignatureOfUser() has no email signature`);
                throw new NotFoundException(NOT_FOUND_EMAIL_SIGNATURE_ERRORS.SIGNATURE);
            }

            Object.entries(updateSignatureUser).forEach(([key, value]) => {
                if (value) emailSignature[key] = value;
            })

            const template: TemplateDocument = await emailSignature.populate(CREATED_TEMPLATE_KEY);

            emailSignature.htmlContent = this.buildSignatureContent(template, emailSignature, SelectedSignature.HTML);
            emailSignature.textContent = this.buildSignatureContent(template, emailSignature, SelectedSignature.TEXT);

            await emailSignature.save();

            Logger.log(`EmailSignatureService->updateSignatureOfUser() saved as: ${Utils.toString(emailSignature)}`);
            const emailSignatureResult = Utils.buildEmailSignatureResultFromEmailSignature(emailSignature);
            Logger.log(`EmailSignatureService>updateSignatureOfUser() got: ${Utils.toString(emailSignatureResult)}`);
            return emailSignatureResult;

        } catch (error) {
            if (error.status) throw error;
            Logger.error(`EmailSignatureService->updateSignatureOfUser() an error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES.UPDATE);
        }
    }

    async bundleEmailSignatureAddition(bundleEmailSignatures: BundleEmailSignaturesCreation): Promise<string[]> {
        Logger.log(`EmailSignatureService->bundleEmailSignatureAddition() entered with: ${Utils.toString(bundleEmailSignatures)}`);
        try {
            const { userEmail, emailSignaturesToAdd } = bundleEmailSignatures;
            const user = await this.userService.getUserByEmail(userEmail);
            if (!user) {
                Logger.warn(`EmailSignatureService->bundleEmailSignatureAdditio() has no user signature`);
                throw new NotFoundException(NOT_FOUND_EMAIL_SIGNATURE_ERRORS.USER);
            }
            const promises: Promise<EmailSignatureResult>[] = emailSignaturesToAdd.map(emailSignatureToAdd => this.buildSingleBundleCreation(emailSignatureToAdd, user))
            const promiseResults: PromiseSettledResult<EmailSignatureResult>[] = await Promise.allSettled(promises);

            const emailAdditionResults = promiseResults.map(promiseResult => {
                if (promiseResult.status ==='fulfilled'){
                    return promiseResult.value.signature;
                }
                else return promiseResult.status;
            });

            Logger.log(`EmailSignatureService->bundleEmailSignatureAddition() got: ${Utils.toString(emailAdditionResults)}`)
            return emailAdditionResults;



        } catch (error) {
            if (error.status) throw error;
            Logger.error(`EmailSignatureService->createEmailSignature() an error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES.BUNDLE_CREATION);
        }
    }

    private async buildSingleBundleCreation(emailSignatureAddition: EmailSignatureAddition, user: UserDocument): Promise<EmailSignatureResult> {
        Logger.log(`EmailSignatureService->buildSingleBundleCreation() entered with: ${Utils.toString(emailSignatureAddition)}, ${Utils.toString(user)}`);
        try {
            const { selectedTemplate } = emailSignatureAddition;
            const template = await this.templateService.getTemplate(selectedTemplate);

            if (!template) {
                Logger.warn(`EmailSignatureService->buildSingleBundleCreation() has not user- can't continue`);
                throw new NotFoundException(NOT_FOUND_EMAIL_SIGNATURE_ERRORS.USER);
            }

            const creationModel: EmailSignature = {
                ...emailSignatureAddition,
                createdUser: user._id,
                htmlContent: this.buildSignatureContent(template, emailSignatureAddition, SelectedSignature.HTML),
                selectedTemplate: template._id,
                textContent: this.buildSignatureContent(template, emailSignatureAddition, SelectedSignature.TEXT),
            }

            const emailSignature = new this.emailSignatureModel(creationModel);
            await emailSignature.save();

            Logger.log(`EmailSignatureService->buildSingleBundleCreation() saved as: ${Utils.toString(emailSignature)}`);
            const emailSignatureResult = Utils.buildEmailSignatureResultFromEmailSignature(emailSignature);
            Logger.log(`EmailSignatureService>buildSingleBundleCreation() got: ${Utils.toString(emailSignatureResult)}`);
            return emailSignatureResult;
        } catch (error) {
            if (error.status) throw error;
            Logger.error(`EmailSignatureService->buildSingleBundleCreation() an error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException(UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES.BUNDLE_CREATION);
        }
    }

    private buildSignatureContent(template: TemplateDocument, signatureRender: SignatureRender, selectedSignature: SelectedSignature): string {
        Logger.log(`EmailSignatureService->buildSignatureContent() entered with: ${Utils.toString(template)}, signatureRender: ${Utils.toString(signatureRender)}, selectedSignature: ${Utils.toString(selectedSignature)}`);
        const contents: Record<SelectedSignature, () => string> = {
            [SelectedSignature.HTML]: () => nunjunks.renderString(template.htmlContent, signatureRender),
            [SelectedSignature.TEXT]: () => nunjunks.renderString(template.textContent, signatureRender)
        }

        const signatureContent = contents[selectedSignature]();

        Logger.log(`EmailSignatureService->buildSignatureContent() got: ${signatureContent}`);
        return signatureContent;
    }

}







