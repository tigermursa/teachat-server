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
exports.UserController = void 0;
const user_model_1 = require("../../user/user.model");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Fetch users excluding the one with the given userId
        const users = yield user_model_1.User.find({ _id: { $ne: userId } });
        // Map through the users to extract relevant data
        const usersData = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                user: {
                    email: user.email,
                    username: user.username,
                    receiverId: user._id,
                    userImage: user.userImage,
                },
            });
        })));
        // Send the response with usersData
        res.status(200).json(usersData);
    }
    catch (error) {
        console.error("Error", error);
        res.status(500).send("An error occurred while fetching users");
    }
});
exports.UserController = {
    getUsers,
};
