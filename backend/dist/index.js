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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config/config");
const middlewares_1 = require("./middlewares");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.userModel.create({ username, password });
        res.json({
            message: "User signed up"
        });
    }
    catch (e) {
        res.status(409).json({
            message: "User already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.userModel.findOne({ username, password });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "Incorrect credentials" });
    }
}));
app.post("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.contentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content Added"
    });
}));
app.get("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.contentModel.find({ userId }).populate('userId', "username");
    res.json(content);
}));
app.delete("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentid;
    try {
        // Only delete if the content belongs to the authenticated user
        const result = yield db_1.contentModel.deleteOne({ _id: contentId, userId: req.userId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Content not found or not authorized to delete" });
            return;
        }
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}));
app.post("/api/v1/brain/share", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    const share = req.body.share;
    const userId = req.userId;
    try {
        if (typeof share !== "boolean") {
            res.status(400).json({
                message: "Invalid share value"
            });
        }
        const content = yield db_1.contentModel.findOne({ _id: contentId, userId });
        if (!content) {
            res.status(403).json({
                message: "Unautherized to share this content"
            });
            return;
        }
        const token = (0, utils_1.random)(10);
        yield db_1.linkModel.create({
            contentId,
            token,
            createdBy: userId,
        });
        res.json({
            shareLink: `${req.protocol}://${req.get("host")}/api/v1/share/${token}`
        });
    }
    catch (e) {
        res.status(500).json({
            message: "server error"
        });
    }
}));
app.get("/api/v1/brain/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const shareLink = yield db_1.linkModel.findOne({ token });
        if (!shareLink) {
            res.status(404).json({
                message: "Invalid share link"
            });
            return;
        }
        if (shareLink.expiresAt < new Date()) {
            res.status(410).json({
                message: "Link expired"
            });
            return;
        }
        const content = yield db_1.contentModel.findById({ _id: shareLink.contentId });
        if (!content) {
            res.status(404).json({
                message: "Content not found"
            });
            return;
        }
        const owner = yield db_1.userModel.findOne({ _id: shareLink.userId });
        if (!owner) {
            res.status(404).json({
                message: "content owner not found"
            });
            return;
        }
        res.json({
            contentOwner: owner === null || owner === void 0 ? void 0 : owner.username,
            sharedContent: content
        });
    }
    catch (e) {
        console.log("share excess error");
        res.status(500).json({
            message: "server error"
        });
    }
}));
app.listen(3000, () => {
    console.log("Server started");
});
