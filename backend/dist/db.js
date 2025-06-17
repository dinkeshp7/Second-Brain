"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkModel = exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://dinkeshgta:VRW03Lpwn2aeT6TP@cluster0.le9ohtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: { type: String }
});
exports.userModel = mongoose_1.default.model("User", userSchema);
const contentSchema = new mongoose_1.default.Schema({
    title: { type: String },
    link: { type: String },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "tag" }],
    userId: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
            required: true
        }]
});
exports.contentModel = mongoose_1.default.model("Content", contentSchema);
const linkSchema = new mongoose_1.default.Schema({
    contentId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Content",
        required: true
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        reqired: true
    },
    hash: {
        type: String,
        unique: true,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
});
exports.linkModel = mongoose_1.default.model("Links", linkSchema);
