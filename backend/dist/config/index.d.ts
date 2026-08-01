export declare const config: {
    port: number;
    nodeEnv: "development" | "production" | "test";
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackURL: string;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    frontend: {
        url: string;
    };
    session: {
        secret: string;
    };
};
//# sourceMappingURL=index.d.ts.map