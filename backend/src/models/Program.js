import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    trainer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
      },
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
    },
    duration: {
      value: {
        type: Number,
      },
      interval: {
        type: String,
        enum: ["days", "weeks", "months"],
      },
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    blocks: [
      {
        name: {
          type: String,
          required: true,
        },
        weeks: {
          type: Number,
          required: true,
        },
        repeat: {
          type: Boolean,
          default: false,
        },
        infinite: {
          type: Boolean,
          default: false,
        },
        repeatTimes: {
          type: Number,
          default: 1,
        },
        workouts: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
          },
        ],
      },
    ],
    recordedSessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", programSchema);

export default Program;
