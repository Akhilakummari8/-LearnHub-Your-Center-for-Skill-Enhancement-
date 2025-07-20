// import React, { useState } from 'react';
// import NavBar from './NavBar';
// import UserHome from "./UserHome"
// import { Container } from 'react-bootstrap';
// import AddCourse from '../user/teacher/AddCourse';

// const Dashboard = () => {
//    const [selectedComponent, setSelectedComponent] = useState('home');

//    const renderSelectedComponent = () => {
//       switch (selectedComponent) {
//          case 'home':
//             return <UserHome />
//          case 'addcourse':
//            return <AddCourse />
//          default:
//             return <UserHome />

//       }
//    };

//    return (
//       <>
//          <NavBar setSelectedComponent={setSelectedComponent} />
//          <Container className='my-3'>
//             {renderSelectedComponent()}
//          </Container>
//       </>
//    );
// };

// export default Dashboard;


import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import UserHome from "./UserHome"
import { Container } from 'react-bootstrap';
import AddCourse from '../user/teacher/AddCourse';
import StudentHome from '../user/student/StudentHome';
import AdminHome from '../admin/AdminHome';
import { UserContext } from '../../App';
import EnrolledCourses from '../user/student/EnrolledCourses';
import CourseContent from '../user/student/CourseContent';
import AllCourses from '../admin/AllCourses';
import Profile from './Profile';
import Settings from './Settings';


const Dashboard = () => {
   const user = useContext(UserContext)
   const [selectedComponent, setSelectedComponent] = useState('home');

   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserHome />
         case 'addcourse':
            return <AddCourse />
         case 'enrolledcourese':
            return <EnrolledCourses />
         case 'cousreSection':
            return <CourseContent />
         case 'cousres':
            return <AllCourses />
         case 'profile':
            return <Profile />
         case 'settings':
            return <Settings />
         default:
            return <UserHome />
      }
   };
   return (
      <>
         <NavBar setSelectedComponent={setSelectedComponent} />
         <Container className='my-3'>
            {renderSelectedComponent()}
         </Container>
      </>
   );
};

export default Dashboard;


