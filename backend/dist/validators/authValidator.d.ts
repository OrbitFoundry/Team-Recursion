export declare const validateRegister: (data: {
    name?: string;
    email?: string;
    password?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateLogin: (data: {
    email?: string;
    password?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateResetPassword: (data: {
    password?: string;
    token?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateForgotPassword: (data: {
    email?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateUpdateProfile: (data: {
    name?: string;
    email?: string;
    techStacks?: string[];
}) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=authValidator.d.ts.map