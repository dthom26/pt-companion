import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    trainer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: [true, "Trainer is required"],
      },
    },
    role: {
      type: String,
      default: "client",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
clientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Client = mongoose.model("Client", clientSchema);

export default Client;
