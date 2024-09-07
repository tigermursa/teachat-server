"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thought = void 0;
const mongoose_1 = require("mongoose");
const thoughtSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, //  setting the current date when creating
        index: { expires: "24h" }, // 24 hours
    },
}, { timestamps: true });
exports.Thought = (0, mongoose_1.model)("thought", thoughtSchema);
