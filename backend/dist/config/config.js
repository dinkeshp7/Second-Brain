"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.JWT_SECRET = "Helloworld";
const mongoose_1 = __importDefault(require("mongoose"));
/*
 * Establishes a connection to a MongoDB database using Mongoose.
 * - Uses the provided connection string.
 * - Logs success or error messages.
 */
const dbConnect = () => {
    mongoose_1.default
        .connect(`${process.env.DBurl}Brainly`)
        .then(() => {
        console.log("Connected Successfully");
    })
        .catch((err) => {
        console.log("Something Wrong", err);
    });
};
exports.default = dbConnect;
