"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("../errors/CustomError");
function verifyToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return next(new CustomError_1.CustomError("Access denied. No token provided.", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token (user info) to the request
        next();
    }
    catch (ex) {
        next(new CustomError_1.CustomError("Invalid token.", 400));
    }
}
