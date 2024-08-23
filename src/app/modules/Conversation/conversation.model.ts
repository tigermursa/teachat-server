import { Schema, model, Document } from "mongoose";

// interface
export interface IConversation extends Document {
  members: string[];
}

// schema
const conversationSchema = new Schema<IConversation>({
  members: {
    type: [String],
    required: true,
  },
});

//the model
const Conversation = model<IConversation>("Conversation", conversationSchema);

export default Conversation;
