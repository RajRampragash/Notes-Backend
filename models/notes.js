import mongoose from "mongoose";

import { Schema} from "mongoose";

 const noteSchema = new Schema({
    // making a foreign key to make a connection between the user: will make sure that each note will also have a user id of the person who have created this note
    user: [{ type: Schema.Types.ObjectId, ref: "user" }],
    // remaining entries to your model
    title: { type: String, required: true },
    body: { type: String, required: true },
    tag: { type: String, required: true },
    date: { type: String, default: Date.now }, // Capital date will be used here
  });

export const Notes = mongoose.model("notes", noteSchema);