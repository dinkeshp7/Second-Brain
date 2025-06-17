import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../models/userModel";
import { Request, Response } from "express";

/*
 * Handles user registration.
 * - Validates required fields.
 * - Checks for existing email.
 * - Hashes password.
 * - Saves new user to database.
 */
export const registeration = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if email already exists
    const checkEmail = await user.findOne({
      email: email,
    });
    if (checkEmail) {
      res.status(409).json({
        message: "Email already exists",
      });
      return;
    }

    // Hash password with bcrypt
    const hashPassword = await bcrypt.hash(password, 5);

    // Create and save new user
    const newUser = new user({
      username: username,
      email: email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: "User successfully created",
    });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Something went wrong while receiving data", err.message);
    } else {
      console.log("Something went wrong while receiving data", err);
    }
    res.status(500).send({
      message: "Something went wrong while receiving data",
    });
    return;
  }
};

/*
 * Handles user login.
 * - Validates required fields.
 * - Checks if user exists.
 * - Verifies password.
 * - Generates and returns JWT token.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Find user by email
    const User = await user.findOne({
      email: email,
    });

    // Check if user exists and has a password
    if (!User || !User.password) {
      res.status(404).json({ message: "User not found or password is missing" });
      return;
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token if SECRET_KEY is available
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY not available");
    }
    const token = jwt.sign({ userID: User._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Optionally set token as HTTP-only cookie (commented out)
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   maxAge: 3600000,
    //   path: "/",
    // });

    res.status(200).json({
      message: "User logged in successfully",
      token,
      userID: User._id,
    });
    return;
  } catch (err) {
    console.log("Something went wrong", err);
    res.status(500).json({
      message: "Something went wrong",
    });
    return;
  }
};
