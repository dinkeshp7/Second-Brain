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
exports.login = exports.registeration = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
/*
 * Handles user registration.
 * - Validates required fields.
 * - Checks for existing email.
 * - Hashes password.
 * - Saves new user to database.
 */
const registeration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Validate required fields
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Check if email already exists
        const checkEmail = yield userModel_1.default.findOne({
            email: email,
        });
        if (checkEmail) {
            res.status(409).json({
                message: "Email already exists",
            });
            return;
        }
        // Hash password with bcrypt
        const hashPassword = yield bcrypt_1.default.hash(password, 5);
        // Create and save new user
        const newUser = new userModel_1.default({
            username: username,
            email: email,
            password: hashPassword,
        });
        yield newUser.save();
        res.status(201).json({
            message: "User successfully created",
        });
        return;
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Something went wrong while receiving data", err.message);
        }
        else {
            console.log("Something went wrong while receiving data", err);
        }
        res.status(500).send({
            message: "Something went wrong while receiving data",
        });
        return;
    }
});
exports.registeration = registeration;
/*
 * Handles user login.
 * - Validates required fields.
 * - Checks if user exists.
 * - Verifies password.
 * - Generates and returns JWT token.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Find user by email
        const User = yield userModel_1.default.findOne({
            email: email,
        });
        // Check if user exists and has a password
        if (!User || !User.password) {
            res.status(404).json({ message: "User not found or password is missing" });
            return;
        }
        // Compare provided password with stored hash
        const isMatch = yield bcrypt_1.default.compare(password, User.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token if SECRET_KEY is available
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY not available");
        }
        const token = jsonwebtoken_1.default.sign({ userID: User._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        // Optionally set token as HTTP-only cookie (commented out)
        // res.cookie("token", token, {
        //   httpOnly: true,
        //   secure: false,
        //   maxAge: 3600000,
        //   path: "/",
        // });
        res.status(200).json({
            message: "User logged in successfully",
            token,
            userID: User._id,
        });
        return;
    }
    catch (err) {
        console.log("Something went wrong", err);
        res.status(500).json({
            message: "Something went wrong",
        });
        return;
    }
});
exports.login = login;
