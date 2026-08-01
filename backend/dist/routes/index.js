"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const companies_1 = __importDefault(require("./companies"));
const resources_1 = __importDefault(require("./resources"));
const dashboard_1 = __importDefault(require("./dashboard"));
const timeline_1 = __importDefault(require("./timeline"));
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json({
        message: 'cooked? API',
        version: '2.0.0',
    });
});
// Auth routes
router.use('/auth', auth_1.default);
// Student routes
router.use('/companies', companies_1.default);
router.use('/resources', resources_1.default);
router.use('/dashboard', dashboard_1.default);
router.use('/timeline', timeline_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map