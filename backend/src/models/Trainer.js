import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const trainerSchema = new mongoose.Schema(
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
    company: {
      type: String,
      maxlength: [100, "Company name cannot exceed 100 characters"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Starter", "Pro", "Enterprise"],
      default: "Free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["trialing", "active", "past_due", "canceled"],
      default: "trialing",
    },
    stripe: {
      customerId: {
        type: String,
      },
      subscriptionId: {
        type: String,
      },
    },
    subscription: {
      plan: String,
      status: String,
      periodStart: Date,
      periodEnd: Date,
      trialEnd: Date,
    },
    signupCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      default: "trainer",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
trainerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Trainer = mongoose.model("Trainer", trainerSchema);

export default Trainer;
