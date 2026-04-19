import Program from "../models/Program.js";
import Client from "../models/Client.js";

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private (Trainer only)
export const createProgram = async (req, res) => {
  try {
    const { name, duration, startDate, endDate, blocks, assignedTo } = req.body;

    const program = await Program.create({
      trainer: {
        id: req.user._id,
      },
      name,
      duration,
      startDate,
      endDate,
      blocks: blocks || [],
      assignedTo: assignedTo || [],
      status: "draft",
    });

    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all programs created by trainer
// @route   GET /api/programs
// @access  Private (Trainer only)
export const getMyPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ "trainer.id": req.user._id })
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single program by ID
// @route   GET /api/programs/:programId
// @access  Private
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId)
      .populate("assignedTo", "firstName lastName email")
      .populate("blocks.workouts");

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check authorization
    if (
      req.userRole === "trainer" &&
      program.trainer.id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this program" });
    }

    if (
      req.userRole === "client" &&
      !program.assignedTo.some(
        (id) => id.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this program" });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:programId
// @access  Private (Trainer only)
export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if trainer owns this program
    if (program.trainer.id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this program" });
    }

    const { name, duration, startDate, endDate, blocks, assignedTo, status } =
      req.body;

    if (name) program.name = name;
    if (duration) program.duration = duration;
    if (startDate) program.startDate = startDate;
    if (endDate) program.endDate = endDate;
    if (blocks) program.blocks = blocks;
    if (assignedTo) program.assignedTo = assignedTo;
    if (status) program.status = status;

    await program.save();

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:programId
// @access  Private (Trainer only)
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if trainer owns this program
    if (program.trainer.id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this program" });
    }

    await program.deleteOne();

    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client's active program
// @route   GET /api/programs/client/active
// @access  Private (Client only)
export const getMyActiveProgram = async (req, res) => {
  try {
    const program = await Program.findOne({
      assignedTo: req.user._id,
      status: "active",
    })
      .populate("blocks.workouts")
      .populate("trainer.id", "firstName lastName");

    if (!program) {
      return res.status(404).json({ message: "No active program found" });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get programs assigned to a specific client
// @route   GET /api/programs/client/:clientId
// @access  Private (Trainer only)
export const getClientPrograms = async (req, res) => {
  try {
    const programs = await Program.find({
      "trainer.id": req.user._id,
      assignedTo: req.params.clientId,
    })
      .populate("blocks.workouts")
      .sort({ createdAt: -1 });

    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
