import Client from "../models/Client.js";
import Program from "../models/Program.js";
import Session from "../models/Session.js";

// @desc    Get all clients for a trainer
// @route   GET /api/trainer/clients
// @access  Private (Trainer only)
export const getMyClients = async (req, res) => {
  try {
    const clients = await Client.find({ "trainer.id": req.user._id })
      .select("-password")
      .sort({ createdAt: -1 });

    // Get basic stats for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const completedSessions = await Session.countDocuments({
          "client.id": client._id,
          completed: true,
        });

        const activePrograms = await Program.countDocuments({
          assignedTo: client._id,
          status: "active",
        });

        return {
          ...client.toObject(),
          stats: {
            completedSessions,
            activePrograms,
          },
        };
      })
    );

    res.json(clientsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single client details with full stats
// @route   GET /api/trainer/clients/:clientId
// @access  Private (Trainer only)
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      "trainer.id": req.user._id,
    }).select("-password");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Get detailed stats
    const completedSessions = await Session.countDocuments({
      "client.id": client._id,
      completed: true,
    });

    const totalSessions = await Session.countDocuments({
      "client.id": client._id,
    });

    const activePrograms = await Program.find({
      assignedTo: client._id,
      status: "active",
    }).populate("blocks.workouts");

    const recentSessions = await Session.find({
      "client.id": client._id,
    })
      .sort({ date: -1 })
      .limit(10)
      .populate("workout.id");

    res.json({
      ...client.toObject(),
      stats: {
        completedSessions,
        totalSessions,
        completionRate:
          totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        activePrograms: activePrograms.length,
      },
      activePrograms,
      recentSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove/unassign a client
// @route   DELETE /api/trainer/clients/:clientId
// @access  Private (Trainer only)
export const removeClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      "trainer.id": req.user._id,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Option 1: Delete the client entirely
    // await client.deleteOne();

    // Option 2: Just unassign (remove trainer reference)
    client.trainer.id = null;
    await client.save();

    res.json({ message: "Client removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update client information
// @route   PUT /api/trainer/clients/:clientId
// @access  Private (Trainer only)
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      "trainer.id": req.user._id,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { firstName, lastName, email, phone } = req.body;

    if (firstName) client.firstName = firstName;
    if (lastName) client.lastName = lastName;
    if (email) client.email = email;
    if (phone) client.phone = phone;

    await client.save();

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
