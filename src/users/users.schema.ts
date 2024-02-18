import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from 'src/users/userConstants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: String, maxlength: MAX_EMAIL_LENGTH })
    email: string;

    @Prop({ required: true, type: String, maxlength: MAX_PHONE_LENGTH })
    phone: string;

    @Prop({ type: String })
    photoUrl?: string;


}

export const UserSchema = SchemaFactory.createForClass(User);