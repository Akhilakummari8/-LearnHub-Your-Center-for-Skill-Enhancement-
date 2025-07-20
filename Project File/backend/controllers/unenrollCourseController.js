// Controller for unenrolling a user from a course
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");
const courseSchema = require("../schemas/courseModel");

const unenrollCourseController = async (req, res) => {
  const { courseid } = req.params;
  const userId = req.body.userId || req.user?.id;
  try {
    // Remove enrollment
    const unenrollResult = await enrolledCourseSchema.findOneAndDelete({
      courseId: courseid,
      userId: userId,
    });
    // Optionally, remove payment record
    await coursePaymentSchema.deleteMany({ courseId: courseid, userId: userId });
    // Optionally, decrement enrolled count
    await courseSchema.findByIdAndUpdate(courseid, { $inc: { enrolled: -1 } });
    if (unenrollResult) {
      return res.status(200).send({ success: true, message: "Unenrolled successfully" });
    } else {
      return res.status(404).send({ success: false, message: "Enrollment not found" });
    }
  } catch (error) {
    console.error("Error in unenrolling course:", error);
    res.status(500).send({ success: false, message: "Failed to unenroll from the course" });
  }
};

module.exports = unenrollCourseController;
