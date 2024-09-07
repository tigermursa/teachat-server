import { Schema, model, Model } from "mongoose";
import { IThought } from "./thought.interface";

export type ThoughtModel = Model<IThought>;

const thoughtSchema: Schema<IThought, ThoughtModel> = new Schema<
  IThought,
  ThoughtModel
>(
  {
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
  },
  { timestamps: true }
);

export const Thought: ThoughtModel = model<IThought, ThoughtModel>(
  "thought",
  thoughtSchema
);
