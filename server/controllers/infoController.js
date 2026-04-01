import userModel from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    // .find({}) gets all documents
    // .select("-password -tasks -productivity") excludes these fields
    const users = await userModel.find({}).select("-password -tasks -productivity");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
