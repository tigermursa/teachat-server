import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/users/:userId", UserController.getUsers);
export const UserExcRoute = router;
