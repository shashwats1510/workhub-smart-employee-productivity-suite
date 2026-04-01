import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../models/user.js";
import productivityModel from "../models/productivity.js";

export const createAccount = async (req, res) => {
  console.log("create account req");
  try {
    const userData = req.body;

    // Check if a user with this email already exists
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const newProductivity = new productivityModel();
    const prod = await newProductivity.save();

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Construct the new user document
    const newUser = new userModel({
      ...userData,
      productivity: prod._id,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "Account created successfully.",
      user: savedUser,
    });
  } catch (error) {
    // Catch Mongoose validation errors or database connection issues
    console.error("Error creating user account:", error);
    return res.status(500).json({
      message: "Failed to create account. Please check your data.",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login req");

  try {
    const userDoc = await userModel.findOne({ email });
    if (!userDoc) return res.status(404).json({ message: "user not found" });

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk)
      return res
        .status(403)
        .json({ message: "Incorrect Username or password" });

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (error, token) => {
        if (error) throw error;
        res.cookie("token", token);
        res.cookie("user_id", userDoc._id);
        res.status(200).json({ id: userDoc._id, email });
      },
    );
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error ${error}` });
  }
};

export const checkLoggedIn = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      loggedIn: false,
      message: "No session found",
      redirect_url: "http://localhost:3000/login",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (error, info) => {
    if (error) {
      // Token is expired or manipulated
      return res.status(401).json({
        loggedIn: false,
        message: "Session expired",
      });
    }

    return res.status(200).json({
      loggedIn: true,
      user: info,
    });
  });
};
