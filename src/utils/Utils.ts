import { Logger } from "@nestjs/common";
import { EmailSignatureResult } from "src/email-signature/dto/response/EmailSignatureResult.dto";
import { EmailSignatureDocument } from "src/email-signature/email-signature.schema";
import { SelectedSignature } from "src/email-signature/emailSignatureConstants";
import { TemplateDocument } from "src/template/template.schema";
import { UserDocument } from "src/users/users.schema";

export class Utils {
    static toString<T>(object: T): string {
        return JSON.stringify(object);
    }

    static chooseSignature(emailSignature: EmailSignatureDocument): string {
        Logger.log(`Utils->chooseSignature() entered with: ${Utils.toString(emailSignature)}`);
        const { htmlContent, textContent, selectedSignature } = emailSignature;
        const signatures: Record<SelectedSignature, string> = {
            [SelectedSignature.HTML]: htmlContent,
            [SelectedSignature.TEXT]: textContent
        }
        const signature = signatures[selectedSignature]
        Logger.log(`EmailSignatureService->chooseSignature() selectedSignature: ${signature}`);
        return signature;
    }

    static buildEmailSignatureResultFromEmailSignature(emailSignature: EmailSignatureDocument): EmailSignatureResult {
        Logger.log(`Utils->buildEmailSignatureResultFromEmailSignature() entered with: ${Utils.toString(emailSignature)}`);
        const { _id, name, email, selectedTemplate: template, createdUser, selectedSignature, phone, photoUrl } = emailSignature;
        return {
            _id,
            name,
            email,
            template,
            createdUser,
            selectedSignature,
            phone,
            photoUrl,
            signature: Utils.chooseSignature(emailSignature)

        }
    }
}