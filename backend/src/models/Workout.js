import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    trainer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
      },
    },
    name: {
      type: String,
      required: [true, "Workout name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    exercises: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        sets: {
          type: Number,
          min: 1,
        },
        reps: {
          type: String,
        },
        weight: {
          type: Number,
        },
        duration: {
          type: Number,
        },
        notes: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
        videoUrl: {
          type: String,
        },
        instructions: {
          type: String,
        },
        bodyPart: {
          type: String,
          enum: [
            "chest",
            "back",
            "legs",
            "shoulders",
            "arms",
            "core",
            "cardio",
            "flexibility",
            "other",
          ],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
