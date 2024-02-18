import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    htmlContent: string;

    @Prop({ required: true, type: String })
    textContent: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true })
    exampleHtmlContent: string;

    @Prop({ required: true })
    exampleTextContent: string;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);