import userModel from "../models/user.js";
import taskModel from "../models/task.js";

export const applyForLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    // 1. Basic Validation
    if (!userId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const normalizedType = leaveType.split(" ")[0].toLowerCase();
    if (!["sick", "casual"].includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave type",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    // Calculate difference in days (+1 to make it inclusive)
    const diffTime = Math.abs(end - start);
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const targetLeave = normalizedType === "sick" ? "sickLeave" : "casualLeave";

    if (user.leaves[targetLeave].remaining < requestedDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You requested ${requestedDays} days, but only have ${user.leaves[targetLeave].remaining} ${normalizedType} days left.`,
      });
    }

    user.leaves[targetLeave].remaining -= requestedDays;

    // Generate entries for the 'taken' array for each day of the leave
    let currentDate = new Date(start);
    while (currentDate <= end) {
      user.leaves.taken.push({
        leaveType: normalizedType,
        date: new Date(currentDate),
        reason: reason,
      });
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Leave applied successfully!",
      data: {
        balances: {
          sick: user.leaves.sickLeave,
          casual: user.leaves.casualLeave,
        },
      },
    });
  } catch (error) {
    console.error("Error applying for leave:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in the query parameters",
      });
    }

    // Fetch all tasks where 'assignedTo' matches the provided user ID
    const tasks = await taskModel.find({ assignedTo: id });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { userId, date, status, clockIn, clockOut } = req.body;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: "User ID and Date are required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const existingEntryIndex = user.attendance.findIndex((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });

    if (existingEntryIndex !== -1) {
      // --- UPDATE EXISTING ENTRY (e.g., User is Clocking Out) ---
      if (status) user.attendance[existingEntryIndex].status = status;
      if (clockIn)
        user.attendance[existingEntryIndex].clockIn = new Date(clockIn);
      if (clockOut)
        user.attendance[existingEntryIndex].clockOut = new Date(clockOut);
    } else {
      // --- CREATE NEW ENTRY (e.g., User is Clocking In for the first time today) ---
      user.attendance.push({
        date: targetDate,
        status: status || "Present",
        clockIn: clockIn ? new Date(clockIn) : null,
        clockOut: clockOut ? new Date(clockOut) : null,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Attendance recorded successfully!",
      data: user.attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const toggleTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Task ID and boolean status are required",
      });
    }

    // Prepare the update object
    const updateData = { status };

    // Automatically set or clear the completedOn date
    if (status === true) {
      updateData.completedOn = new Date(); // Set to exactly right now
    } else {
      updateData.completedOn = null; // Clear it if they un-check the task
    }

    // Update the task in the database
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }, // Returns the updated document
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
