import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';
import { Template, TemplateDocument } from '../template/template.schema';
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from 'src/users/userConstants';
import { SelectedSignature } from './emailSignatureConstants';

export type EmailSignatureDocument = HydratedDocument<EmailSignature>;

@Schema()
export class EmailSignature {

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdUser: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Template' })
    selectedTemplate: Types.ObjectId;

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    name: string;

    @Prop({ required: true, type: String, maxlength: MAX_EMAIL_LENGTH })
    email: string;

    @Prop({ required: true, type: String, maxlength: MAX_PHONE_LENGTH })
    phone: string;

    @Prop({ type: String })
    photoUrl?: string;

    @Prop({ required: true })
    htmlContent: string;


    @Prop({ required: true, type: String })
    selectedSignature: SelectedSignature;

    @Prop({ required: true, type: String })
    textContent: string;


}

export const EmailSignatureSchema = SchemaFactory.createForClass(EmailSignature);