import express from "express";
import { UsersController } from "./user.controller";

//router
const router = express.Router();

//crud end points
router.get("/get", UsersController.getAllUsers);
router.get("/:id", UsersController.getSingleUser);
router.delete("/:id", UsersController.deleteUser);
router.patch("/:id", UsersController.updateUser);

export const UserRoutes = router;
