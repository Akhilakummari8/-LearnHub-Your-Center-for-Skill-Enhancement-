const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");

const router = express.Router();

// Get all users
router.get("/getallusers", authMiddleware, async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (!allUsers) return res.status(404).send({ message: "No users found" });
    res.status(200).send({ success: true, data: allUsers });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get all courses
router.get("/getallcourses", authMiddleware, async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses) return res.status(404).send({ message: "No courses found" });
    res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get all enrollments with user and course info
router.get("/enrollments", authMiddleware, async (req, res) => {
  try {
    const enrollments = await enrolledCourseSchema.find()
      .populate('userId', 'name email')
      .populate('courseId', 'C_title');
    res.status(200).send({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Delete user by id
router.delete("/deleteuser/:userid", authMiddleware, require("../controllers/adminController").deleteUserController);

module.exports = router;
