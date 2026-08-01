export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export declare const registerUser: (data: RegisterData) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        isEmailVerified: boolean;
        techStacks: string[] | undefined;
        resumeUrl: string | undefined;
    };
    token: string;
}>;
export declare const loginUser: (data: LoginData) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        isEmailVerified: boolean;
        techStacks: string[] | undefined;
        resumeUrl: string | undefined;
    };
    token: string;
}>;
export declare const forgotPassword: (rawEmail: string) => Promise<{
    message: string;
}>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        isEmailVerified: boolean;
        techStacks: string[] | undefined;
        resumeUrl: string | undefined;
    };
    token: string;
}>;
export declare const findOrCreateGoogleUser: (googleId: string, email: string, name: string) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        isEmailVerified: boolean;
        techStacks: string[] | undefined;
        resumeUrl: string | undefined;
    };
    token: string;
}>;
export declare const updateUserProfile: (userId: string, data: {
    name?: string;
    email?: string;
    techStacks?: string[];
}) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        isEmailVerified: boolean;
        techStacks: string[] | undefined;
        resumeUrl: string | undefined;
    };
}>;
//# sourceMappingURL=authService.d.ts.map