import Message from "../models/Message.js";

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverRole, content } = req.body;

    const message = await Message.create({
      sender: {
        id: req.user._id,
        role: req.userRole === "trainer" ? "Trainer" : "Client",
      },
      receiver: {
        id: receiverId,
        role: receiverRole,
      },
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.find({
      $or: [
        { "sender.id": req.user._id, "receiver.id": userId },
        { "sender.id": userId, "receiver.id": req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json(messages.reverse()); // Reverse to get chronological order
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ "sender.id": req.user._id }, { "receiver.id": req.user._id }],
    }).sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId =
        message.sender.id.toString() === req.user._id.toString()
          ? message.receiver.id.toString()
          : message.sender.id.toString();

      if (!conversationsMap.has(partnerId)) {
        const unreadCount = messages.filter(
          (m) =>
            m.receiver.id.toString() === req.user._id.toString() &&
            m.sender.id.toString() === partnerId &&
            !m.read
        ).length;

        conversationsMap.set(partnerId, {
          partnerId,
          partnerRole:
            message.sender.id.toString() === req.user._id.toString()
              ? message.receiver.role
              : message.sender.role,
          lastMessage: message,
          unreadCount,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread messages
// @route   GET /api/messages/unread
// @access  Private
export const getUnreadMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      "receiver.id": req.user._id,
      read: false,
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      "receiver.id": req.user._id,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all messages from a user as read
// @route   PUT /api/messages/conversation/:userId/read
// @access  Private
export const markConversationAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      {
        "sender.id": req.params.userId,
        "receiver.id": req.user._id,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.json({ message: "Conversation marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
