import express from "express";
import { signup } from "./auth.signup";
import { login } from "./auth.login";
import { logout } from "./auth.logout";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

export const AuthRoutes = router;
