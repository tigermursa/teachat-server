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
exports.ThoughtController = void 0;
const thought_services_1 = require("./thought.services");
const thought_zodValidation_1 = require("./thought.zodValidation");
// Create Thought
const createThought = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = (0, thought_zodValidation_1.validateThought)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error!",
                errors: validationResult.error.errors,
            });
        }
        const thoughtData = req.body;
        //the service function
        const result = yield thought_services_1.ThoughtServices.createThoughtInDB(thoughtData);
        res.status(200).json({
            success: true,
            message: "Thought created successfully!",
            data: result,
        });
    }
    catch (err) {
        //error message
        if (err.message === "You already shared your thought today") {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        // Handle other errors
        res.status(500).json({
            success: false,
            message: "Error creating thought!",
            error: err.message,
        });
    }
});
// Get-All
const getAllThought = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { thought, totalThought } = yield thought_services_1.ThoughtServices.getAllThoughtFromDB();
        res.status(200).json({
            success: true,
            message: "Thoughts retrieved successfully ✔",
            totalThought: totalThought,
            data: thought,
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
const getSingleThought = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.id;
        const result = yield thought_services_1.ThoughtServices.getSingleThoughtFromDB(thoughtId);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID or thought does not exist",
            });
        }
        res.status(200).json({
            success: true,
            message: "Single thought retrieved successfully ✔",
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
const deleteThought = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.id;
        const result = yield thought_services_1.ThoughtServices.deleteThoughtFromDB(thoughtId);
        // Type guard to differentiate between the two types
        if ("matchedCount" in result) {
            if (result.matchedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid ID or thought does not exist",
                });
            }
        }
        else {
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Thought was not deleted",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Thought deleted successfully!",
                data: result,
            });
        }
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
const updateThought = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.id;
        const updatedData = req.body;
        const result = yield thought_services_1.ThoughtServices.updateThoughtFromDB(thoughtId, updatedData);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID or thought does not exist",
            });
        }
        res.status(200).json({
            success: true,
            message: "thought updated successfully!",
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
// Get thoughts by userId
const getThoughtByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const result = yield thought_services_1.ThoughtServices.getThoughtByUserId(userId);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No thought found for this user",
            });
        }
        res.status(200).json({
            success: true,
            message: "Thought retrieved successfully",
            data: result, // Directly return the thought object
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving thought",
            error: error.message,
        });
    }
});
exports.ThoughtController = {
    createThought,
    getAllThought,
    getSingleThought,
    updateThought,
    deleteThought,
    getThoughtByUser,
};
