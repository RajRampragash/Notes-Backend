import mongoose from "mongoose";
const date = new Date();
import { Schema} from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: String, default: date.now },
  });

export const user = mongoose.model("user", userSchema);