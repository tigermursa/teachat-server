"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const user_services_1 = require("./user.services");
// Get-All
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { users, totalUsers } = yield user_services_1.UserServices.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully ✔",
            totalUsers: totalUsers,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong !!!",
            error: error.message,
        });
    }
});
// Get One
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield user_services_1.UserServices.getSingleUserFromDB(userId);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID or user does not exist",
            });
        }
        res.status(200).json({
            success: true,
            message: "Single user retrieved successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong !!!",
            error: error.message,
        });
    }
});
// Delete One
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield user_services_1.UserServices.deleteUserFromDB(userId);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID or user does not exist",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong !!!",
            error: error.message,
        });
    }
});
//Update One
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const result = yield user_services_1.UserServices.updateUserFromDB(userId, updatedData);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID or user does not exist",
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Please try with another email ",
            error: error.message,
        });
    }
});
const getUserByIDArray = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty array of user IDs",
            });
        }
        const users = yield user_services_1.UserServices.getUsersDetailByIDArray(userIds);
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found for the provided IDs",
            });
        }
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully ✔",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong !!!",
            error: error.message,
        });
    }
});
exports.UsersController = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    getUserByIDArray,
};
