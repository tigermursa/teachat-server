"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThoughtRoutes = void 0;
const express_1 = __importDefault(require("express"));
const thought_controller_1 = require("./thought.controller");
//router
const router = express_1.default.Router();
//crud end points
router.post("/create", thought_controller_1.ThoughtController.createThought);
router.get("/get", thought_controller_1.ThoughtController.getAllThought);
router.get("/:id", thought_controller_1.ThoughtController.getSingleThought);
router.delete("/:id", thought_controller_1.ThoughtController.deleteThought);
router.patch("/:id", thought_controller_1.ThoughtController.updateThought);
router.get("/info/:userId", thought_controller_1.ThoughtController.getThoughtByUser);
exports.ThoughtRoutes = router;
