"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// schema
const conversationSchema = new mongoose_1.Schema({
    members: {
        type: [String],
        required: true,
    },
});
//the model
const Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
exports.default = Conversation;
