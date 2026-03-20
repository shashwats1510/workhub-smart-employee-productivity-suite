import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const salt = bcrypt.genSaltSync(10);
export const createAccount = async (req, res) => {
  console.log("req");
  const { email, password, name, accountType, phoneNo, dateOfBirth, post } =
    req.body;

  try {
    const userDoc = await User.create({
      email,
      password: bcrypt.hashSync(password, salt),
      name,
      accountType,
      phoneNo,
      dateOfBirth,
      post,
    });
    if (!userDoc) {
      throw new Error("Failed to create user");
    }
    res.status(201).json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
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
