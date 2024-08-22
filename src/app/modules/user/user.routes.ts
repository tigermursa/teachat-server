import express from "express";
import { UsersController } from "./user.controller";
import { verifyToken } from "../../middlewares/verifyJWT";

//router
const router = express.Router();

//crud end points
router.get("/get", verifyToken, UsersController.getAllUsers); // Protected route
router.get("/:id", verifyToken, UsersController.getSingleUser); // Protected route
router.delete("/:id", verifyToken, UsersController.deleteUser); // Protected route
router.patch("/:id", verifyToken, UsersController.updateUser); // Protected route

export const UserRoutes = router;
