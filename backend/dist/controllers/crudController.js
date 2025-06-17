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
exports.shareContent = exports.deleteContent = exports.content = exports.newContent = void 0;
const contentModel_1 = __importDefault(require("../models/contentModel"));
/*
 * Creates new content for the authenticated user.
 * - Validates required fields.
 * - Saves new content to the database.
 * @param req - Authenticated request containing user ID and content details.
 * @param res - Express response object.
 */
const newContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, contentType, title, tag } = req.body;
        const userid = req.userID;
        // Validate required fields (tag is optional)
        if (!link || !contentType || !title || !userid) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Create and save new content
        const contentCreated = new contentModel_1.default({
            link: link,
            contentType: contentType,
            title: title,
            tag: tag, // Optional
            userId: userid,
        });
        yield contentCreated.save();
        res.status(200).json({
            message: "Content saved Successfully",
        });
        return;
    }
    catch (err) {
        console.log("Err(catch): something went wrong", err);
        res.status(500).json({ message: "Something went wrong" }); // Send error response
        return;
    }
});
exports.newContent = newContent;
/*
 * Retrieves all content for the authenticated user.
 * @param req - Authenticated request containing user ID.
 * @param res - Express response object.
 */
const content = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.userID;
        // Validate user ID
        if (!userid) {
            res.status(400).json({ message: "Something wrong" });
            return;
        }
        // Find all content for the user
        const userData = yield contentModel_1.default.find({ userId: userid });
        res.status(200).json({
            message: "User data fetched successfully",
            data: userData,
        });
        console.log(userData);
    }
    catch (err) {
        console.log("Err(catch): something went wrong", err);
        res.status(500).json({ message: "Something went wrong" }); // Send error response
        return;
    }
});
exports.content = content;
/*
 * Deletes content for the authenticated user.
 * - Validates user ID and content ID.
 * - Checks if content exists and belongs to the user.
 * - Deletes the content.
 * @param req - Authenticated request containing user ID and content ID.
 * @param res - Express response object.
 */
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.userID;
        const userTitle = req.params.contentId;
        console.log("userid =>", userid);
        console.log("contentid =>", userTitle);
        // Validate user ID and content ID
        if (!userid || !userTitle) {
            res.status(400).json({ message: "User ID or Content ID missing" });
            return;
        }
        // Find the content by title and user ID
        const content = yield contentModel_1.default.findOne({ title: userTitle, userId: userid });
        if (!content) {
            res.status(404).json({ message: "Content not found or unauthorized" });
            return;
        }
        // Delete the content by its _id (not by the document object)
        // NOTE: `findByIdAndDelete` expects the _id, not the document object.
        // You should use: await userContent.findByIdAndDelete(content._id);
        yield contentModel_1.default.findByIdAndDelete(content._id);
        res.status(200).json({ message: "Content deleted successfully" });
        return;
    }
    catch (err) {
        console.log("Err(catch): something went wrong", err);
        res.status(500).json({ message: "Something went wrong" }); // Send error response
        return;
    }
});
exports.deleteContent = deleteContent;
/*
 * Shares all content for a specific user (by user ID).
 * @param req - Request containing user ID in params.
 * @param res - Express response object.
 */
const shareContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const documents = yield contentModel_1.default.find({ userId });
        res.status(200).json({ data: documents });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.shareContent = shareContent;
