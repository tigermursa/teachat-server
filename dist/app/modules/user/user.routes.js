"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
// import { verifyToken } from "../../middlewares/verifyJWT";
//router
const router = express_1.default.Router();
//crud end points
router.get("/get", user_controller_1.UsersController.getAllUsers); // Protected route
router.get("/:id", user_controller_1.UsersController.getSingleUser); // Protected route
router.delete("/:id", user_controller_1.UsersController.deleteUser); // Protected route
router.patch("/:id", user_controller_1.UsersController.updateUser); // Protected route
router.post("/array", user_controller_1.UsersController.getUserByIDArray);
exports.UserRoutes = router;
