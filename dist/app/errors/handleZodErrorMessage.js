"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodErrorMessage = handleZodErrorMessage;
function handleZodErrorMessage(error) {
    return error.errors.map((error) => error.message).join(", ");
}
