export enum UNKNOWN_ERROR_EMAIL_SIGNATURE_MESSAGES {
    CREATION = "Unknown error occured when EmailSignature's creation",
    GET = "Unknown error occured when EmailSignature's reterive",
    UPDATE = "Unknown error occured when EmailSignature's update",
    DELETE = "Unknown error occured when EmailSignature's delete",
    GET_ALL = "Unknown error occured when getAll EmailSignatures",
    BUNDLE_CREATION =  "Unknown error occured when EmailSignatures bundle creation"

}

export enum NOT_FOUND_EMAIL_SIGNATURE_ERRORS {
    USER = "USER OF EMAIL SIGNATURE NOT FOUND",
    SIGNATURE= "EMAIL SIGNATURE NOT FOUND "
}

export enum SelectedSignature {
    HTML = "html",
    TEXT = "text"
}


export const CREATED_TEMPLATE_KEY = "selectedTemplate";