import express from "express";
import { UsersController } from "./user.controller";
// import { verifyToken } from "../../middlewares/verifyJWT";

//router
const router = express.Router();

//crud end points
router.get("/get",  UsersController.getAllUsers); // Protected route
router.get("/:id",  UsersController.getSingleUser); // Protected route
router.delete("/:id",  UsersController.deleteUser); // Protected route
router.patch("/:id",  UsersController.updateUser); // Protected route

export const UserRoutes = router;
