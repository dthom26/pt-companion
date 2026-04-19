import Session from "../models/Session.js";
import Workout from "../models/Workout.js";
import Program from "../models/Program.js";

// @desc    Start a new workout session
// @route   POST /api/sessions
// @access  Private (Client only)
export const startSession = async (req, res) => {
  try {
    const { workoutId, programId, date } = req.body;

    // Verify workout exists
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Create session with exercises from workout
    const exercises = workout.exercises.map((exercise) => ({
      exerciseId: exercise._id.toString(),
      name: exercise.name,
      sets: Array(exercise.sets || 3).fill({
        reps: 0,
        weight: 0,
        completed: false,
      }),
      completed: false,
    }));

    const session = await Session.create({
      client: {
        id: req.user._id,
      },
      workout: {
        id: workoutId,
      },
      program: programId ? { id: programId } : undefined,
      date: date || new Date(),
      exercises,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update exercise in session (log sets/reps/weight)
// @route   PUT /api/sessions/:sessionId/exercises/:exerciseId
// @access  Private (Client only)
export const updateExerciseInSession = async (req, res) => {
  try {
    const { sessionId, exerciseId } = req.params;
    const { sets, notes, completed } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      "client.id": req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find and update the exercise
    const exercise = session.exercises.find(
      (ex) => ex.exerciseId === exerciseId
    );
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found in session" });
    }

    if (sets) exercise.sets = sets;
    if (notes !== undefined) exercise.notes = notes;
    if (completed !== undefined) exercise.completed = completed;

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete entire session
// @route   PUT /api/sessions/:sessionId/complete
// @access  Private (Client only)
export const completeSession = async (req, res) => {
  try {
    const { durationMinutes, notes } = req.body;

    const session = await Session.findOne({
      _id: req.params.sessionId,
      "client.id": req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.completed = true;
    session.completedAt = new Date();
    if (durationMinutes) session.durationMinutes = durationMinutes;
    if (notes) session.notes = notes;

    await session.save();

    // Add session to program's recordedSessions if part of a program
    if (session.program && session.program.id) {
      await Program.findByIdAndUpdate(session.program.id, {
        $addToSet: { recordedSessions: session._id },
      });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client's session history
// @route   GET /api/sessions
// @access  Private (Client only)
export const getMySessions = async (req, res) => {
  try {
    const { limit = 20, startDate, endDate } = req.query;

    const query = { "client.id": req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate("workout.id")
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single session by ID
// @route   GET /api/sessions/:sessionId
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId).populate(
      "workout.id"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check authorization
    if (
      req.userRole === "client" &&
      session.client.id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this session" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client's sessions (for trainers)
// @route   GET /api/sessions/client/:clientId
// @access  Private (Trainer only)
export const getClientSessions = async (req, res) => {
  try {
    const { limit = 20, startDate, endDate } = req.query;

    const query = { "client.id": req.params.clientId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate("workout.id")
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
