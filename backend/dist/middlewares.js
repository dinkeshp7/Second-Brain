"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config/config");
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({
            message: "Unauthorized: token missing"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(401).json({
            message: "Unauthorized user"
        });
    }
};
exports.userMiddleware = userMiddleware;
