import { Types } from "mongoose";
import { SelectedSignature } from "src/email-signature/emailSignatureConstants";


export interface EmailSignatureResult {
    _id: Types.ObjectId;
    template: Types.ObjectId;
    createdUser: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    photoUrl?: string;
    signature: string;
    selectedSignature: SelectedSignature;
}