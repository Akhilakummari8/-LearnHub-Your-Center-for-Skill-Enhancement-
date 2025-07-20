import React, { useContext, useState } from 'react'
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import { UserContext } from '../../App';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavBar = ({ setSelectedComponent }) => {
   const user = useContext(UserContext)
   const navigate = useNavigate();
   const [showLogoutModal, setShowLogoutModal] = useState(false);

   if (!user) {
      return null
   }

   const handleLogout = () => {
      setShowLogoutModal(true);
   }
   
   const confirmLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("purchasedCourses");
      window.location.href = "/";
   }
   
   const handleOptionClick = (component) => {
      setSelectedComponent(component);
   };

   const getUserTypeIcon = () => {
      switch(user.userData.type) {
         case 'Admin': return 'bi-shield-fill-check';
         case 'Teacher': return 'bi-mortarboard-fill';
         case 'Student': return 'bi-person-fill';
         default: return 'bi-person-fill';
      }
   };

   const getUserTypeColor = () => {
      switch(user.userData.type) {
         case 'Admin': return '#dc3545';
         case 'Teacher': return '#28a745';
         case 'Student': return '#17a2b8';
         default: return '#6c757d';
      }
   };

   return (
      <>
      {showLogoutModal && (
         <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.3 }}
               style={{
                  background: 'white',
                  color: '#333',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: '20px',
                  padding: '40px 50px',
                  boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                  minWidth: 400,
                  textAlign: 'center',
                  position: 'relative',
                  border: '3px solid #667eea',
               }}
            >
               <div style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
               }}>
                  <i className="bi bi-box-arrow-right" style={{fontSize: '2rem', color: 'white'}}></i>
               </div>
               <h4 style={{marginBottom: '15px', color: '#667eea'}}>Confirm Logout</h4>
               <p style={{marginBottom: '25px', color: '#666'}}>Are you sure you want to log out of your account?</p>
               <div style={{display: 'flex', justifyContent: 'center', gap: 15}}>
                  <Button 
                     variant="danger" 
                     style={{
                        fontWeight: 600, 
                        minWidth: 100, 
                        borderRadius: 10,
                        padding: '10px 20px'
                     }} 
                     onClick={confirmLogout}
                  >
                     <i className="bi bi-check-lg me-2"></i>Yes, Logout
                  </Button>
                  <Button 
                     variant="outline-secondary" 
                     style={{
                        fontWeight: 600, 
                        minWidth: 100, 
                        borderRadius: 10,
                        padding: '10px 20px'
                     }} 
                     onClick={()=>setShowLogoutModal(false)}
                  >
                     <i className="bi bi-x-lg me-2"></i>Cancel
                  </Button>
               </div>
               <button 
                  onClick={() => setShowLogoutModal(false)} 
                  style={{
                     position: 'absolute',
                     top: 15,
                     right: 20,
                     background: 'none',
                     border: 'none',
                     fontSize: 24,
                     color: '#999',
                     cursor: 'pointer',
                     transition: 'color 0.3s ease'
                  }} 
                  onMouseOver={e => e.target.style.color = '#dc3545'}
                  onMouseOut={e => e.target.style.color = '#999'}
                  aria-label="Close popup"
               >
                  ×
               </button>
            </motion.div>
         </div>
      )}
      
      <Navbar expand="lg" className="navbar shadow-sm" sticky="top" style={{zIndex: 1000}}>
         <Container fluid>
            <Navbar.Brand>
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{display:'flex', alignItems:'center', gap:'15px'}}
               >
                  <i className="bi bi-mortarboard-fill" style={{fontSize:'2.2rem', color:'#667eea'}}></i>
                  <h3 style={{
                     fontWeight:'800', 
                     margin:0, 
                     background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                     WebkitBackgroundClip: 'text', 
                     WebkitTextFillColor: 'transparent'
                  }}>
                     LearnHub
                  </h3>
               </motion.div>
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  <motion.div
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2, duration: 0.5 }}
                  >
                     <Nav.Link 
                        href="/dashboard"
                        style={{
                           fontWeight: 600,
                           color: '#333',
                           marginRight: 15,
                           padding: '8px 16px',
                           borderRadius: 8,
                           transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => {
                           e.target.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
                           e.target.style.color = 'white';
                           e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={e => {
                           e.target.style.background = 'transparent';
                           e.target.style.color = '#333';
                           e.target.style.transform = 'translateY(0)';
                        }}
                     >
                        <i className="bi bi-house-fill me-2"></i>Dashboard
                     </Nav.Link>
                  </motion.div>

                  {user.userData.type === 'Teacher' && (
                     <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                     >
                        <Nav.Link 
                           onClick={() => handleOptionClick('addcourse')}
                           style={{
                              fontWeight: 600,
                              color: '#333',
                              marginRight: 15,
                              padding: '8px 16px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                           }}
                           onMouseOver={e => {
                              e.target.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'translateY(-2px)';
                           }}
                           onMouseOut={e => {
                              e.target.style.background = 'transparent';
                              e.target.style.color = '#333';
                              e.target.style.transform = 'translateY(0)';
                           }}
                        >
                           <i className="bi bi-plus-circle-fill me-2"></i>Add Course
                        </Nav.Link>
                     </motion.div>
                  )}

                  {user.userData.type === 'Admin' && (
                     <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                     >
                        <Nav.Link 
                           onClick={() => handleOptionClick('cousres')}
                           style={{
                              fontWeight: 600,
                              color: '#333',
                              marginRight: 15,
                              padding: '8px 16px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                           }}
                           onMouseOver={e => {
                              e.target.style.background = 'linear-gradient(45deg, #dc3545, #fd7e14)';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'translateY(-2px)';
                           }}
                           onMouseOut={e => {
                              e.target.style.background = 'transparent';
                              e.target.style.color = '#333';
                              e.target.style.transform = 'translateY(0)';
                           }}
                        >
                           <i className="bi bi-gear-fill me-2"></i>Manage Courses
                        </Nav.Link>
                     </motion.div>
                  )}

                  {user.userData.type === 'Student' && (
                     <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                     >
                        <Nav.Link 
                           onClick={() => handleOptionClick('enrolledcourese')}
                           style={{
                              fontWeight: 600,
                              color: '#333',
                              marginRight: 15,
                              padding: '8px 16px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                           }}
                           onMouseOver={e => {
                              e.target.style.background = 'linear-gradient(45deg, #17a2b8, #6f42c1)';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'translateY(-2px)';
                           }}
                           onMouseOut={e => {
                              e.target.style.background = 'transparent';
                              e.target.style.color = '#333';
                              e.target.style.transform = 'translateY(0)';
                           }}
                        >
                           <i className="bi bi-book-fill me-2"></i>My Courses
                        </Nav.Link>
                     </motion.div>
                  )}
               </Nav>
               
               <Nav style={{alignItems: 'center', gap: 15}}>
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.4, duration: 0.5 }}
                     style={{display: 'flex', alignItems: 'center', gap: 15}}
                  >
                     <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '8px 15px',
                        borderRadius: 20,
                        border: '2px solid rgba(102, 126, 234, 0.2)'
                     }}>
                        <div style={{
                           background: `linear-gradient(45deg, ${getUserTypeColor()}, ${getUserTypeColor()}dd)`,
                           borderRadius: '50%',
                           width: 35,
                           height: 35,
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center'
                        }}>
                           <i className={getUserTypeIcon()} style={{color: 'white', fontSize: '1rem'}}></i>
                        </div>
                        <div>
                           <div style={{fontWeight: 700, color: '#333', fontSize: '0.9rem'}}>
                              {user.userData.name}
                           </div>
                           <div style={{fontSize: '0.75rem', color: getUserTypeColor(), fontWeight: 600}}>
                              {user.userData.type}
                           </div>
                        </div>
                     </div>
                     
                     <Dropdown>
                        <Dropdown.Toggle 
                           variant="outline-danger" 
                           size="sm"
                           style={{
                              borderRadius: 20,
                              padding: '8px 16px',
                              fontWeight: 600,
                              border: '2px solid #dc3545',
                              transition: 'all 0.3s ease'
                           }}
                        >
                           <i className="bi bi-three-dots-vertical"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="start" style={{
                           borderRadius: 15, 
                           border: 'none', 
                           boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                           overflowX: 'auto',
                           maxWidth: 220,
                           minWidth: 180,
                           whiteSpace: 'nowrap',
                           left: '-150px', // shift menu to the left of the button
                           right: 'auto',
                           position: 'absolute',
                           zIndex: 2000
                        }}>
                           <Dropdown.Item 
                              onClick={() => handleOptionClick('profile')}
                              style={{borderRadius: 10, margin: '2px', padding: '10px 15px'}}
                           >
                              <i className="bi bi-person-circle me-2"></i>Profile
                           </Dropdown.Item>
                           <Dropdown.Item 
                              onClick={() => handleOptionClick('settings')}
                              style={{borderRadius: 10, margin: '2px', padding: '10px 15px'}}
                           >
                              <i className="bi bi-gear me-2"></i>Settings
                           </Dropdown.Item>
                           <Dropdown.Divider />
                           <Dropdown.Item 
                              onClick={handleLogout}
                              style={{
                                 borderRadius: 10, 
                                 margin: '2px', 
                                 padding: '10px 15px',
                                 color: '#dc3545',
                                 fontWeight: 600
                              }}
                           >
                              <i className="bi bi-box-arrow-right me-2"></i>Logout
                           </Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </motion.div>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
      </>
   )
}

export default NavBar