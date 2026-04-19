import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
      },
    },
    workout: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
        required: true,
      },
    },
    program: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
    },
    exercises: [
      {
        exerciseId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        sets: [
          {
            reps: {
              type: Number,
            },
            weight: {
              type: Number,
            },
            completed: {
              type: Boolean,
              default: false,
            },
            rpe: {
              type: Number,
              min: 1,
              max: 10,
            },
          },
        ],
        notes: {
          type: String,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
