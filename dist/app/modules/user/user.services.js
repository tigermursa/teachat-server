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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
// getAll data
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find().exec(); // Retrieve all users
    const totalUsers = yield user_model_1.User.countDocuments().exec(); // Count total users
    return { users, totalUsers };
});
// getSingle user
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if the ID is a valid MongoDB ObjectId format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        const result = yield user_model_1.User.findOne({ _id: id }).exec();
        return result;
    }
    catch (error) {
        throw new Error("Error retrieving user from database");
    }
});
// delete
const deleteUserFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        return { matchedCount: 0 }; // Return no match if ID is invalid
    }
    // Check if the user exists
    const userExists = yield user_model_1.User.findById(_id).exec();
    if (!userExists) {
        return { matchedCount: 0 }; // Return no match if user does not exist
    }
    // Mark user as deleted
    const result = yield user_model_1.User.updateOne({ _id }, { isDeleted: true }).exec();
    return result;
});
//update
const updateUserFromDB = (_id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
            return { matchedCount: 0 }; // Return no match if ID is invalid
        }
        // Check if the user exists
        const userExists = yield user_model_1.User.findById(_id).exec();
        if (!userExists) {
            return { matchedCount: 0 }; // Return no match if user does not exist
        }
        // Perform the update
        const result = yield user_model_1.User.updateOne({ _id }, { $set: updatedData }).exec();
        return result;
    }
    catch (error) {
        console.error("Error updating user:", error.message);
        throw new Error("Error updating user: " + error.message);
    }
});
const getUsersDetailByIDArray = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if all IDs are valid MongoDB ObjectId formats
        const validIds = userIds.filter((id) => mongoose_1.default.Types.ObjectId.isValid(id));
        if (validIds.length === 0) {
            return null;
        }
        // Find users whose IDs match the valid ones in the array and project specific fields
        const users = yield user_model_1.User.find({ _id: { $in: validIds } })
            .select("_id username userImage work age email") // Only include the fields you need
            .exec();
        return users;
    }
    catch (error) {
        throw new Error("Error retrieving users from database");
    }
});
//exports:
exports.UserServices = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUserFromDB,
    getUsersDetailByIDArray,
};
