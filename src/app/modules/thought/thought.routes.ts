import express from "express";
import { ThoughtController } from "./thought.controller";

//router
const router = express.Router();

//crud end points
router.post("/create", ThoughtController.createThought);
router.get("/get", ThoughtController.getAllThought);
router.get("/:id", ThoughtController.getSingleThought);
router.delete("/:id", ThoughtController.deleteThought);
router.patch("/:id", ThoughtController.updateThought);
router.get("/info/:userId", ThoughtController.getThoughtByUser);
export const ThoughtRoutes = router;
