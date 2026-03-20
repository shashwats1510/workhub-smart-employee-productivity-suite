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
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) return res.status(403).json("Incorrect Username or password");

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (error, token) => {
        if (error) throw error;
        res.cookie("token", token);
        res.cookie("user_id", userDoc._id);
        res.json({ id: userDoc._id, email });
      },
    );
  } catch (error) {
    res.status(500).json(`Internal Server Error ${error}`);
  }
};
