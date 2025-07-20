const express = require("express");
const multer = require("multer");
const path = require("path");
const courseSchema = require("../schemas/courseModel");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  getAllCoursesController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
  addSectionToCourseController,
  updateCourseController, // <-- add this
} = require("../controllers/userControllers");
const unenrollCourseController = require("../controllers/unenrollCourseController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".avi" && ext !== ".mov" && ext !== ".wmv") {
      return callback(new Error("Only video files are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit (increased from 100MB)
  }
});

// Authentication routes
router.post("/register", registerController);
router.post("/login", loginController);

// Course management routes
router.post(
  "/addcourse",
  authMiddleware,
  upload.array("S_content"),
  postCourseController
);

router.get("/getallcourses", getAllCoursesController);

router.get(
  "/getallcoursesteacher",
  authMiddleware,
  getAllCoursesUserController
);

router.delete(
  "/deletecourse/:courseid",
  authMiddleware,
  deleteCourseController
);

// Add section to existing course
router.post(
  '/addsection/:courseId',
  authMiddleware,
  upload.single('S_content'),
  addSectionToCourseController
);

// Student enrollment routes
router.post(
  "/enrolledcourse/:courseid",
  authMiddleware,
  enrolledCourseController
);

router.delete(
  "/enrolledcourse/:courseid",
  authMiddleware,
  unenrollCourseController
);

router.get(
  "/coursecontent/:courseid",
  authMiddleware,
  sendCourseContentController
);

router.post("/completemodule", authMiddleware, completeSectionController);

router.get("/getallcoursesuser", authMiddleware, sendAllCoursesUserController);

// Get enrolled courses for student
router.get("/enrolledcourses", authMiddleware, async (req, res) => {
  try {
    const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
    const courseSchema = require("../schemas/courseModel");
    
    const enrolledCourses = await enrolledCourseSchema.find({ userId: req.body.userId });
    const coursesDetails = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => {
        const courseDetails = await courseSchema.findOne({
          _id: enrolledCourse.courseId,
        });
        return courseDetails;
      })
    );

    return res.status(200).send({
      success: true,
      data: coursesDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update user name
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const userId = req.user.id;
    const user = await require('../schemas/userModel').findByIdAndUpdate(userId, { name }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Name updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a single course by ID (for editing)
router.get(
  "/course/:courseId",
  authMiddleware,
  async (req, res) => {
    try {
      const course = await courseSchema.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
      res.json({ success: true, course });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Update course by ID
router.put(
  "/course/:courseId",
  authMiddleware,
  upload.any(), // Accept any files (for section videos)
  updateCourseController
);

module.exports = router;