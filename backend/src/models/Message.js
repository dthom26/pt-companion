import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "sender.role",
      },
      role: {
        type: String,
        required: true,
        enum: ["Trainer", "Client"],
      },
    },
    receiver: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiver.role",
      },
      role: {
        type: String,
        required: true,
        enum: ["Trainer", "Client"],
      },
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient conversation queries
messageSchema.index({ "sender.id": 1, "receiver.id": 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
