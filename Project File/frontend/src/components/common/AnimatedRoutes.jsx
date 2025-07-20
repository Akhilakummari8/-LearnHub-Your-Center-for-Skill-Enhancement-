import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransitionWrapper from "./PageTransitionWrapper";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CourseContent from "../user/student/CourseContent";
import { useContext } from "react";
import { UserContext } from "../../App";
import Profile from "./Profile";
import Settings from "./Settings";
import AddSection from '../user/teacher/AddSection';
import AddCourse from '../user/teacher/AddCourse';
import EditCourse from '../user/teacher/EditCourse';

const AnimatedRoutes = () => {
  const location = useLocation();
  const { userLoggedIn } = useContext(UserContext);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransitionWrapper direction="right"><Home /></PageTransitionWrapper>} />
        <Route path="/login" element={<PageTransitionWrapper direction="left"><Login /></PageTransitionWrapper>} />
        <Route path="/register" element={<PageTransitionWrapper direction="left"><Register /></PageTransitionWrapper>} />
        {userLoggedIn ? (
          <>
            <Route path="/dashboard" element={<PageTransitionWrapper direction="right"><Dashboard /></PageTransitionWrapper>} />
            <Route path="/courseSection/:courseId/:courseTitle" element={<PageTransitionWrapper direction="right"><CourseContent /></PageTransitionWrapper>} />
            <Route path="/profile" element={<PageTransitionWrapper direction="right"><Profile /></PageTransitionWrapper>} />
            <Route path="/settings" element={<PageTransitionWrapper direction="right"><Settings /></PageTransitionWrapper>} />
            <Route path="/teacher/add-section" element={<PageTransitionWrapper direction="right"><AddSection /></PageTransitionWrapper>} />
            <Route path="/teacher/add-course" element={<PageTransitionWrapper direction="right"><AddCourse /></PageTransitionWrapper>} />
            <Route path="/teacher/edit-course/:courseId" element={<PageTransitionWrapper direction="right"><EditCourse /></PageTransitionWrapper>} />
          </>
        ) : (
          <Route path="/login" element={<PageTransitionWrapper direction="left"><Login /></PageTransitionWrapper>} />
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
