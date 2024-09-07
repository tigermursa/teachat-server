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
exports.ThoughtServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const thought_model_1 = require("./thought.model");
//create
const createThoughtInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a thought from the same user already exists
    const existingThought = yield thought_model_1.Thought.findOne({ userId: data.userId }).exec();
    if (existingThought) {
        throw new Error("You already shared your thought today");
    }
    // Create a new thought if none exists
    const result = yield thought_model_1.Thought.create(data);
    return result;
});
// getAll data
const getAllThoughtFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const thought = yield thought_model_1.Thought.find().exec();
    const totalThought = yield thought_model_1.Thought.countDocuments().exec();
    return { thought, totalThought };
});
// getSingle Thought
const getSingleThoughtFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if the ID is a valid MongoDB ObjectId format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        const result = yield thought_model_1.Thought.findOne({ _id: id }).exec();
        return result;
    }
    catch (error) {
        throw new Error("Error retrieving Thought from database");
    }
});
//delete
const deleteThoughtFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        return { matchedCount: 0 }; // Return no match if ID is invalid
    }
    // Check if the Thought exists
    const thoughtExists = yield thought_model_1.Thought.findById(_id).exec();
    if (!thoughtExists) {
        return { matchedCount: 0 }; // Return no match if Thought does not exist
    }
    // Mark Thought as deleted
    const result = yield thought_model_1.Thought.deleteOne({ _id }).exec();
    return result;
});
//update
const updateThoughtFromDB = (_id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
            return { matchedCount: 0 }; // Return no match if ID is invalid
        }
        // Check if the Thought exists
        const ThoughtExists = yield thought_model_1.Thought.findById(_id).exec();
        if (!ThoughtExists) {
            return { matchedCount: 0 }; // Return no match if Thought does not exist
        }
        // Perform the update
        const result = yield thought_model_1.Thought.updateOne({ _id }, { $set: updatedData }).exec();
        return result;
    }
    catch (error) {
        console.error("Error updating Thought:", error.message);
        throw new Error("Error updating Thought: " + error.message);
    }
});
// Fetch thoughts by userId
const getThoughtByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if the userId is a non-empty string
        if (!userId || typeof userId !== "string") {
            throw new Error("Invalid user ID");
        }
        // Find a single thought by userId
        const thought = yield thought_model_1.Thought.findOne({ userId }).exec();
        // Return the thought if it exists, otherwise return null
        return thought || null;
    }
    catch (error) {
        throw new Error("Error retrieving thought by userId: ");
    }
});
//exports:
exports.ThoughtServices = {
    createThoughtInDB,
    getAllThoughtFromDB,
    getSingleThoughtFromDB,
    deleteThoughtFromDB,
    updateThoughtFromDB,
    getThoughtByUserId,
};
