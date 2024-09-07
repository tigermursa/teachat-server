"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // name of this error is the same as the class name
        this.name = this.constructor.name;
        //  the stack trace if not in production
        if (process.env.NODE_ENV !== "production") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.CustomError = CustomError;
//this is using in auth.login
//this is using in auth.signup
