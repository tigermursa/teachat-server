import { Request, Response } from "express";
import { ThoughtServices } from "./thought.services";

// Create Appointment
const createThought = async (req: Request, res: Response) => {
  try {
    const appointmentData = req.body;
    // Populate the mentor and student details
    const populatedResult = await ThoughtServices.createThought(
      appointmentData
    );

    res.status(200).json({
      success: true,
      message: "Thought created successfully!",
      data: populatedResult,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error creating appointment!",
      error: err.message,
    });
  }
};

// Get-All
const getAllThought = async (req: Request, res: Response) => {
  try {
    const { thought, totalThought } =
      await ThoughtServices.getAllThoughtFromDB();
    res.status(200).json({
      success: true,
      message: "Thoughts retrieved successfully ✔",

      totalThought: totalThought,
      data: thought,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

// Get One
const getSingleThought = async (req: Request, res: Response) => {
  try {
    const thoughtId = req.params.id;
    const result = await ThoughtServices.getSingleThoughtFromDB(thoughtId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

// Delete One
const deleteThought = async (req: Request, res: Response) => {
  try {
    const thoughtId = req.params.id;
    const result = await ThoughtServices.deleteThoughtFromDB(thoughtId);

    // Type guard to differentiate between the two types
    if ("matchedCount" in result) {
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Invalid ID or thought does not exist",
        });
      }
    } else {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

//Update One
const updateThought = async (req: Request, res: Response) => {
  try {
    const thoughtId = req.params.id;
    const updatedData = req.body;
    const result = await ThoughtServices.updateThoughtFromDB(
      thoughtId,
      updatedData
    );

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Please try with another email ",
      error: error.message,
    });
  }
};

export const ThoughtController = {
  createThought,
  getAllThought,
  getSingleThought,
  updateThought,
  deleteThought,
};
