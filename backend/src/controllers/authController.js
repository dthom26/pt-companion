import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";
import Client from "../models/Client.js";
import { generateSignupCode } from "../utils/generateSignupCode.js";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new trainer
// @route   POST /api/auth/trainer/register
// @access  Public
export const registerTrainer = async (req, res) => {
  try {
    const { email, password, firstName, lastName, company, phone } = req.body;

    // Check if trainer exists
    const trainerExists = await Trainer.findOne({ email });
    if (trainerExists) {
      return res
        .status(400)
        .json({ message: "Trainer already exists with this email" });
    }

    // Generate unique signup code for this trainer's clients
    const signupCode = generateSignupCode();

    // Create trainer
    const trainer = await Trainer.create({
      email,
      password,
      firstName,
      lastName,
      company,
      phone,
      signupCode,
      role: "trainer",
    });

    if (trainer) {
      res.status(201).json({
        _id: trainer._id,
        email: trainer.email,
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        company: trainer.company,
        phone: trainer.phone,
        role: trainer.role,
        signupCode: trainer.signupCode,
        token: generateToken(trainer._id, trainer.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new client with signup code
// @route   POST /api/auth/client/register
// @access  Public
export const registerClient = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, signupCode } =
      req.body;

    // Validate signup code and find trainer
    const trainer = await Trainer.findOne({ signupCode });
    if (!trainer) {
      return res.status(400).json({ message: "Invalid signup code" });
    }

    // Check if client exists
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res
        .status(400)
        .json({ message: "Client already exists with this email" });
    }

    // Create client
    const client = await Client.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      trainer: {
        id: trainer._id,
      },
      role: "client",
    });

    if (client) {
      res.status(201).json({
        _id: client._id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        role: client.role,
        trainer: {
          id: client.trainer.id,
          name: `${trainer.firstName} ${trainer.lastName}`,
        },
        token: generateToken(client._id, client.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user (trainer or client)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    // Find user based on role
    if (role === "trainer") {
      user = await Trainer.findOne({ email }).select("+password");
    } else if (role === "client") {
      user = await Client.findOne({ email }).select("+password");
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      const responseData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id, user.role),
      };

      // Add trainer-specific data
      if (role === "trainer") {
        responseData.signupCode = user.signupCode;
        responseData.company = user.company;
      }

      // Add client-specific data
      if (role === "client") {
        responseData.trainer = user.trainer;
      }

      res.json(responseData);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    const responseData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // Add trainer-specific data
    if (user.role === "trainer") {
      responseData.signupCode = user.signupCode;
      responseData.company = user.company;
      responseData.plan = user.plan;
      responseData.subscriptionStatus = user.subscriptionStatus;
    }

    // Add client-specific data
    if (user.role === "client") {
      responseData.trainer = user.trainer;
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  // JWT logout is handled on client side by removing token
  res.json({ message: "Logged out successfully" });
};
