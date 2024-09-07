"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_signup_1 = require("./auth.signup");
const auth_login_1 = require("./auth.login");
const auth_logout_1 = require("./auth.logout");
const router = express_1.default.Router();
// Signup route
router.post("/signup", auth_signup_1.signup);
// Login route
router.post("/login", auth_login_1.login);
// Logout route
router.post("/logout", auth_logout_1.logout);
exports.AuthRoutes = router;
