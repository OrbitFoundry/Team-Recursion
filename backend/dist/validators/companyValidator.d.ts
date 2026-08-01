export declare const validateCreateCompany: (data: {
    companyName?: string;
    role?: string;
    applicationDate?: string;
    status?: string;
    companyLink?: string;
    techStacks?: string[];
    notes?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateUpdateCompany: (data: {
    companyName?: string;
    role?: string;
    applicationDate?: string;
    status?: string;
    companyLink?: string;
    techStacks?: string[];
    notes?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=companyValidator.d.ts.map