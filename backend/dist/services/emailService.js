"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendPasswordResetEmail = exports.isEmailServiceConfigured = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
// Helper function to check if email is configured
const isEmailConfigured = () => {
    // config.email.user and config.email.pass are already trimmed strings from config
    const emailUser = (config_1.config.email.user || '').trim();
    const emailPass = (config_1.config.email.pass || '').trim();
    return emailUser !== '' && emailPass !== '';
};
// Get email config values (already trimmed in config, but trim again for safety)
const emailUser = (config_1.config.email.user || '').trim();
const emailPass = (config_1.config.email.pass || '').trim();
const hasEmailConfig = isEmailConfigured();
// Check if we should use SendGrid API (bypasses SMTP blocking)
const useSendGridAPI = hasEmailConfig &&
    (emailUser === 'apikey' || config_1.config.email.host.includes('sendgrid'));
// Initialize SendGrid API if configured
if (useSendGridAPI && emailPass.startsWith('SG.')) {
    mail_1.default.setApiKey(emailPass);
    logger_1.logger.info('Email service configured - Using SendGrid API (bypasses SMTP)');
    logger_1.logger.info(`SendGrid API key configured (starts with: ${emailPass.substring(0, 8)}...)`);
}
else if (hasEmailConfig) {
    logger_1.logger.info('Email service configured');
    logger_1.logger.info(`Email host: ${config_1.config.email.host}:${config_1.config.email.port}`);
    logger_1.logger.info(`Email user: ${emailUser}`);
    // Log host in production to help debug
    if (process.env.NODE_ENV === 'production') {
        logger_1.logger.info(`Using email service: ${config_1.config.email.host}`);
    }
    else {
        logger_1.logger.debug(`Email host: ${config_1.config.email.host}:${config_1.config.email.port}`);
    }
}
else {
    logger_1.logger.warn('Email service not configured - EMAIL_USER and EMAIL_PASS must be set in .env file');
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        logger_1.logger.info('Email service not configured - Debug Info:');
        logger_1.logger.info(`   config.email.user: "${config_1.config.email.user || ''}" (length: ${(config_1.config.email.user || '').length})`);
        logger_1.logger.info(`   config.email.pass: ${config_1.config.email.pass ? 'SET (hidden)' : 'EMPTY'} (length: ${(config_1.config.email.pass || '').length})`);
        logger_1.logger.info(`   process.env.EMAIL_USER: ${process.env.EMAIL_USER ? `"${process.env.EMAIL_USER}"` : 'NOT SET'}`);
        logger_1.logger.info(`   process.env.EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET'}`);
        logger_1.logger.info(`   Final emailUser: "${emailUser}" (empty: ${emailUser === ''})`);
        logger_1.logger.info(`   Final emailPass: ${emailPass ? 'SET (hidden)' : 'EMPTY'} (empty: ${emailPass === ''})`);
        logger_1.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        logger_1.logger.info('To configure email service:');
        logger_1.logger.info('1. Add EMAIL_USER=your-email@gmail.com to backend/.env');
        logger_1.logger.info('2. Add EMAIL_PASS=your-app-password to backend/.env');
        logger_1.logger.info('3. For Gmail, use an App Password (not your regular password)');
        logger_1.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
const transporter = hasEmailConfig
    ? nodemailer_1.default.createTransport({
        host: config_1.config.email.host,
        port: config_1.config.email.port,
        secure: config_1.config.email.port === 465, // true for 465, false for other ports
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        // Connection timeout settings for production environments
        connectionTimeout: 5000, // 5 seconds to establish connection
        greetingTimeout: 5000, // 5 seconds for SMTP greeting
        socketTimeout: 10000, // 10 seconds for socket operations
    })
    : null;
// Verify transporter connection on startup (only if configured)
// Skip verification in production as network restrictions may prevent it
// Actual email sending will handle errors gracefully
if (hasEmailConfig && transporter && process.env.NODE_ENV !== 'production') {
    // Set a timeout for verification (5 seconds)
    const verifyTimeout = setTimeout(() => {
        logger_1.logger.debug('Email verification timeout - this is normal if SMTP connections are restricted');
    }, 5000);
    transporter.verify((error) => {
        clearTimeout(verifyTimeout);
        if (error) {
            logger_1.logger.warn('Email service connection verification failed:', error.message);
            logger_1.logger.debug('This may be normal if SMTP connections are restricted. Email sending will still be attempted.');
        }
        else {
            logger_1.logger.info('Email service connection verified successfully');
        }
    });
}
else if (hasEmailConfig && transporter && process.env.NODE_ENV === 'production') {
    logger_1.logger.info('Email service configured (verification skipped in production)');
}
// Export function to check if email is configured
const isEmailServiceConfigured = () => {
    return hasEmailConfig && (useSendGridAPI || transporter !== null);
};
exports.isEmailServiceConfigured = isEmailServiceConfigured;
const sendPasswordResetEmail = async (email, resetToken) => {
    if (!hasEmailConfig) {
        const resetUrl = `${config_1.config.frontend.url}/reset-password?token=${resetToken}`;
        logger_1.logger.warn('Email service not configured. Password reset email not sent.');
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            logger_1.logger.info('📧 Password Reset Link (Development Mode):');
            logger_1.logger.info(`   ${resetUrl}`);
            logger_1.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
        return;
    }
    const resetUrl = `${config_1.config.frontend.url}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
  `;
    // Use SendGrid API if configured (bypasses SMTP)
    if (useSendGridAPI) {
        try {
            logger_1.logger.info(`Sending password reset email to ${email} via SendGrid API`);
            await mail_1.default.send({
                to: email,
                from: config_1.config.email.from,
                subject: 'Password Reset Request',
                html: emailHtml,
            });
            logger_1.logger.info(`Password reset email sent successfully to ${email} via SendGrid API`);
            return;
        }
        catch (error) {
            logger_1.logger.error('Error sending email via SendGrid API', error);
            throw new Error('Failed to send password reset email');
        }
    }
    // Fallback to SMTP for other providers
    if (!transporter) {
        logger_1.logger.warn('Email transporter not configured');
        return;
    }
    const mailOptions = {
        from: config_1.config.email.from,
        to: email,
        subject: 'Password Reset Request',
        html: emailHtml,
    };
    try {
        logger_1.logger.info(`Attempting to send password reset email to ${email} via ${config_1.config.email.host}`);
        // Add timeout wrapper for email sending (15 seconds for production network delays)
        let timeoutId;
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Email sending timeout - SMTP connection may be blocked by your hosting provider')), 15000);
        });
        try {
            await Promise.race([sendPromise, timeoutPromise]);
        }
        finally {
            clearTimeout(timeoutId);
        }
        logger_1.logger.info(`Password reset email sent successfully to ${email}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error('Error sending password reset email', error);
        logger_1.logger.error(`Email host attempted: ${config_1.config.email.host}:${config_1.config.email.port}`);
        // Provide helpful error message for common issues
        if (errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
            logger_1.logger.warn('SMTP connection failed - This may be due to network restrictions on your hosting provider (Render, Heroku, etc.)');
            logger_1.logger.warn('Consider using SendGrid API by setting EMAIL_USER=apikey and using your SendGrid API key as EMAIL_PASS');
        }
        throw new Error('Failed to send password reset email');
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendWelcomeEmail = async (email, name) => {
    if (!hasEmailConfig) {
        // Silently skip if email not configured
        return;
    }
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for signing up. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
  `;
    // Use SendGrid API if configured
    if (useSendGridAPI) {
        try {
            await mail_1.default.send({
                to: email,
                from: config_1.config.email.from,
                subject: 'Welcome to Our App!',
                html: emailHtml,
            });
            logger_1.logger.info(`Welcome email sent to ${email} via SendGrid API`);
            return;
        }
        catch (error) {
            logger_1.logger.error('Error sending welcome email via SendGrid API', error);
            // Don't throw error for welcome email
            return;
        }
    }
    // Fallback to SMTP
    if (!transporter) {
        return;
    }
    const mailOptions = {
        from: config_1.config.email.from,
        to: email,
        subject: 'Welcome to Our App!',
        html: emailHtml,
    };
    try {
        await transporter.sendMail(mailOptions);
        logger_1.logger.info(`Welcome email sent to ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Error sending welcome email', error);
        // Don't throw error for welcome email
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=emailService.js.map