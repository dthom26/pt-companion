import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";
import Client from "../models/Client.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (check both Trainer and Client)
      if (decoded.role === "trainer") {
        req.user = await Trainer.findById(decoded.id).select("-password");
      } else if (decoded.role === "client") {
        req.user = await Client.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      req.userRole = decoded.role;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict routes to trainers only
export const trainerOnly = (req, res, next) => {
  if (req.userRole !== "trainer") {
    return res.status(403).json({ message: "Access denied. Trainers only." });
  }
  next();
};

// Middleware to restrict routes to clients only
export const clientOnly = (req, res, next) => {
  if (req.userRole !== "client") {
    return res.status(403).json({ message: "Access denied. Clients only." });
  }
  next();
};
