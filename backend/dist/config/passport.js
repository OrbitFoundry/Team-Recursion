"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const index_1 = require("./index");
const authService_1 = require("../services/authService");
const logger_1 = require("../utils/logger");
// Only initialize Google OAuth if credentials are provided
if (index_1.config.google.clientId && index_1.config.google.clientSecret) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: index_1.config.google.clientId,
        clientSecret: index_1.config.google.clientSecret,
        callbackURL: index_1.config.google.callbackURL,
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const { id, emails, displayName } = profile;
            const email = emails?.[0]?.value;
            if (!email) {
                return done(new Error('No email found in Google profile'), undefined);
            }
            const result = await (0, authService_1.findOrCreateGoogleUser)(id, email, displayName || '');
            return done(null, result);
        }
        catch (error) {
            const err = error;
            return done(err, undefined);
        }
    }));
    logger_1.logger.info('Google OAuth configured');
}
else {
    logger_1.logger.debug('Google OAuth not configured (optional)');
}
passport_1.default.serializeUser((user, done) => {
    if (typeof user === 'object' && 'user' in user && user.user?.id) {
        done(null, user.user.id);
    }
    else if (typeof user === 'string') {
        done(null, user);
    }
    else {
        done(null, '');
    }
});
passport_1.default.deserializeUser((id, done) => {
    done(null, { id });
});
//# sourceMappingURL=passport.js.map