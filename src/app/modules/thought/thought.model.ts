import { Schema, model, Model } from "mongoose";
import { IThought } from "./thought.interface";

export type ThoughtModel = Model<IThought>;

const thoughtSchema: Schema = new Schema<IThought, ThoughtModel>({
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
});

export const Thought: ThoughtModel = model<IThought, ThoughtModel>(
  "thought",
  thoughtSchema
);
