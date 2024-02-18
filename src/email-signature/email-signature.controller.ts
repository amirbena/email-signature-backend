import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EMAIL_SIGNATURE_ID_PARAM, EmailSignatureRoutes, Routes } from 'src/constants/routes.constants';
import { EmailSignatureService } from './email-signature.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { EmailSignatureCreation } from './dto/request/EmailSignatureCreation.dto';
import { USER_TOKEN_PAYLOAD } from 'src/constants/constants';
import { TokenDto } from 'src/users/dto/request/TokenDto';
import { EmailSignatureResult } from './dto/response/EmailSignatureResult.dto';
import { BundleEmailSignaturesCreation } from './dto/request/BundleEmailSignatureAddition.dto';
import { EmailSignatureUpdate } from './dto/request/EmailSignatureUpdate.dto';
import { Types } from 'mongoose';

@Controller(Routes.EmailSignatures)
export class EmailSignatureController {
    constructor(private emailSignatureService: EmailSignatureService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async createEmailSignature(@Body() emailSignatureCreation: EmailSignatureCreation, @Body(USER_TOKEN_PAYLOAD) tokenDto: TokenDto): Promise<EmailSignatureResult> {

        const emailSignature: EmailSignatureResult = await this.emailSignatureService.createEmailSignature(emailSignatureCreation, tokenDto);
        return emailSignature;

    }

    @Post(EmailSignatureRoutes.WEBHOOK)
    @UsePipes(ValidationPipe)
    async bundleEmailSignatureCreation(@Body() bundleEmailCreation: BundleEmailSignaturesCreation): Promise<string[]> {

        const bundleCreationResults: string[] = await this.emailSignatureService.bundleEmailSignatureAddition(bundleEmailCreation);
        return bundleCreationResults;
    }

    @Get()
    @UseGuards(AuthGuard)
    async getEmailSignaturesByUser(@Body(USER_TOKEN_PAYLOAD) tokenDto: TokenDto){
        return await this.emailSignatureService.getAllSignaturesByUser(tokenDto);
    }


    @Put(`/:${EMAIL_SIGNATURE_ID_PARAM}`)
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async updateEmailSignature(@Param(EMAIL_SIGNATURE_ID_PARAM) id: Types.ObjectId, @Body(USER_TOKEN_PAYLOAD) tokenDto: TokenDto,
        @Body() emailSignatureUpdate: EmailSignatureUpdate): Promise<EmailSignatureResult> {

        const updateSignature: EmailSignatureResult = await this.emailSignatureService.updateSignatureOfUser(id, tokenDto, emailSignatureUpdate);
        return updateSignature
    }
}
