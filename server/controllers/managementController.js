import userModel from "../models/user.js";
import taskModel from "../models/task.js";

export const applyForLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const requestedDays =
      Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

    const user = await userModel.findById(userId);

    // Logic to calculate pending days remains similar,
    // but sum the 'duration' of all pending items in history
    const alreadyPending = user.leaves.history
      .filter(
        (l) =>
          l.status === "Pending" &&
          l.leaveType === leaveType.split(" ")[0].toLowerCase(),
      )
      .reduce((acc, curr) => acc + curr.duration, 0);

    const balanceKey = leaveType.includes("sick") ? "sickLeave" : "casualLeave";
    if (user.leaves[balanceKey].remaining - alreadyPending < requestedDays) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // PUSH ONLY ONE ENTRY
    user.leaves.history.push({
      leaveType: leaveType.split(" ")[0].toLowerCase(),
      startDate: start,
      endDate: end,
      duration: requestedDays,
      reason: reason,
      status: "Pending",
    });

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Leave applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleLeaveAction = async (req, res) => {
  try {
    const { userId, leaveId, action, adminNote } = req.body;
    const user = await userModel.findById(userId);
    const leaveRequest = user.leaves.history.id(leaveId);

    if (action === "Approved") {
      const balanceKey =
        leaveRequest.leaveType === "sick" ? "sickLeave" : "casualLeave";
      // Subtract the whole duration at once
      user.leaves[balanceKey].remaining -= leaveRequest.duration;
      leaveRequest.status = "Approved";
    } else {
      leaveRequest.status = "Declined";
    }

    leaveRequest.respondedAt = new Date();
    leaveRequest.adminNote = adminNote;
    await user.save();
    res.status(200).json({ success: true, message: `Leave ${action}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error processing leave" });
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

export const getEmployees = async (req, res) => {
  try {
    const employees = await userModel.find(
      { post: "Employee" },
      "name role post _id",
    );

    // If no employees are found, it will just return an empty array [], which is fine!
    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching employees.",
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const { assignedTo, title, description, deadLine, status } = req.body;

    if (!assignedTo || !title || !deadLine) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (assignedTo, title, deadLine).",
      });
    }

    const userExists = await userModel.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned employee not found.",
      });
    }

    const newTask = new taskModel({
      assignedTo,
      title,
      description: description || "",
      deadLine: new Date(deadLine),
      status: status || false,
    });

    const savedTask = await newTask.save();

    await userModel.findByIdAndUpdate(
      assignedTo,
      { $push: { tasks: savedTask._id } },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      message: "Task created and assigned successfully!",
      data: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating task.",
    });
  }
};

export const editUserDetails = async (req, res) => {
  try {
    // Extract everything that MIGHT be sent by either the Admin or Manager panels
    const { id, name, email, post, role, salary, phoneNo, dob, password } =
      req.body;

    // 1. Basic validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to perform an update.",
      });
    }

    // 2. Fetch the user document
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in the database.",
      });
    }

    // 3. Dynamically update fields ONLY if they were provided in the request
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (post !== undefined) user.post = post;
    if (role !== undefined) user.role = role;
    if (salary !== undefined) user.salary = salary;
    if (phoneNo !== undefined) user.phoneNo = phoneNo;
    if (dob !== undefined) user.dob = new Date(dob);

    // 4. Handle Password specifically (only update if it's not empty)
    // The Admin panel sends an empty string if they don't want to change it.
    if (password && password.trim() !== "") {
      user.password = password;
    }

    // 5. Save the document
    // This will automatically trigger your userSchema.pre("save") middleware to hash the password if it was changed!
    await user.save();

    // 6. Return success
    return res.status(200).json({
      success: true,
      message: "User details updated successfully!",
      data: {
        _id: user._id,
        name: user.name,
        role: user.role,
        post: user.post,
      },
    });
  } catch (error) {
    // Handle duplicate email errors (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "That email is already in use by another account.",
      });
    }

    console.error("Error editing user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating user details.",
    });
  }
};
