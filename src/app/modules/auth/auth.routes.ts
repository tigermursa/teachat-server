import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

// Signup route
router.post("/signup", AuthController.signup);

// Login route
router.post("/login", AuthController.login);

// Logout route
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
