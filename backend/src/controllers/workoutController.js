import Workout from "../models/Workout.js";

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private (Trainer only)
export const createWorkout = async (req, res) => {
  try {
    const { name, description, exercises } = req.body;

    const workout = await Workout.create({
      trainer: {
        id: req.user._id,
      },
      name,
      description,
      exercises: exercises || [],
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workouts created by trainer
// @route   GET /api/workouts
// @access  Private (Trainer only)
export const getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ "trainer.id": req.user._id }).sort({
      createdAt: -1,
    });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single workout by ID
// @route   GET /api/workouts/:workoutId
// @access  Private
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Check authorization for trainer
    if (
      req.userRole === "trainer" &&
      workout.trainer.id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this workout" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:workoutId
// @access  Private (Trainer only)
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Check if trainer owns this workout
    if (workout.trainer.id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this workout" });
    }

    const { name, description, exercises } = req.body;

    if (name) workout.name = name;
    if (description) workout.description = description;
    if (exercises) workout.exercises = exercises;

    await workout.save();

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:workoutId
// @access  Private (Trainer only)
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Check if trainer owns this workout
    if (workout.trainer.id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this workout" });
    }

    await workout.deleteOne();

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
