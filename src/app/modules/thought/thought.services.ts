import mongoose, { ObjectId } from "mongoose";
import { Thought } from "./thought.model";
import { IThought } from "./thought.interface";
import { DeleteResult } from "mongodb";
//create
//1.create
const createThought = async (data: IThought) => {
  const result = await Thought.create(data);
  return result;
};

// getAll data
const getAllThoughtFromDB = async () => {
  const thought = await Thought.find().exec();
  const totalThought = await Thought.countDocuments().exec();
  return { thought, totalThought };
};

// getSingle Thought
const getSingleThoughtFromDB = async (id: string) => {
  try {
    // Validate if the ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const result = await Thought.findOne({ _id: id }).exec();
    return result;
  } catch (error) {
    throw new Error("Error retrieving Thought from database");
  }
};
//delete
const deleteThoughtFromDB = async (
  _id: string
): Promise<DeleteResult | { matchedCount: number }> => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { matchedCount: 0 }; // Return no match if ID is invalid
  }

  // Check if the Thought exists
  const thoughtExists = await Thought.findById(_id).exec();
  if (!thoughtExists) {
    return { matchedCount: 0 }; // Return no match if Thought does not exist
  }

  // Mark Thought as deleted
  const result: DeleteResult = await Thought.deleteOne({ _id }).exec();
  return result;
};

//update
const updateThoughtFromDB = async (
  _id: string | ObjectId,
  updatedData: Partial<IThought>
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id as string)) {
      return { matchedCount: 0 }; // Return no match if ID is invalid
    }

    // Check if the Thought exists
    const ThoughtExists = await Thought.findById(_id).exec();
    if (!ThoughtExists) {
      return { matchedCount: 0 }; // Return no match if Thought does not exist
    }

    // Perform the update
    const result = await Thought.updateOne(
      { _id },
      { $set: updatedData }
    ).exec();
    return result;
  } catch (error: any) {
    console.error("Error updating Thought:", error.message);
    throw new Error("Error updating Thought: " + error.message);
  }
};
//exports:
export const ThoughtServices = {
  createThought,
  getAllThoughtFromDB,
  getSingleThoughtFromDB,
  deleteThoughtFromDB,
  updateThoughtFromDB,
};
