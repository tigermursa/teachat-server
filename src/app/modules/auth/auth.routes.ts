import express from "express";
import { AuthController } from "./auth.controller";
import { verifyToken } from "../../middlewares/verifyJWT";

const router = express.Router();

// Signup route
router.post("/signup", AuthController.signup);

// Login route
router.post("/login", verifyToken, AuthController.login);

// Logout route
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
