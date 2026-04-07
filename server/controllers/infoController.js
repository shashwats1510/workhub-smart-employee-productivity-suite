import userModel from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    // .find({}) gets all documents
    // .select("-password -tasks -productivity") excludes these fields
    const users = await userModel
      .find({})
      .select("-password -tasks -productivity");

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

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required in query parameters" 
      });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    
    if (error.kind === "ObjectId") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid User ID format" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};
