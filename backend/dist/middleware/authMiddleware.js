"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from headers (improved type check)
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.headers.token;
        if (typeof token !== "string" || !token) {
            res.status(401).json({ message: "Authentication required" }); // 401 for auth errors
            return;
        }
        // Validate secret key presence
        if (!process.env.SECRET_KEY) {
            res.status(500).json({ message: "Server configuration error" });
            return;
        }
        // Verify token and type cast correctly
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.userID = decoded.userID; // Now properly typed as string
        next();
    }
    catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ message: "Invalid or expired token" }); // Generic message for security
        return;
    }
});
exports.isAuthenticated = isAuthenticated;
