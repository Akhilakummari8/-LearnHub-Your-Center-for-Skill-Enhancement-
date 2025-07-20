import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import { motion } from 'framer-motion';

const Login = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: "",
      password: "",
   })
   const [errors, setErrors] = useState({});
   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");

   // Redirect if already logged in
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         navigate('/dashboard', { replace: true });
      }
   }, [navigate]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      let newErrors = {};
      if (!data.email) newErrors.email = 'Required field';
      if (!data.password) newErrors.password = 'Required field';
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      axiosInstance.post('/api/user/login', data)
         .then((res) => {
            if (res.data && res.data.success) {
               setPopupMessage(res.data.message || "Login successful");
               setShowPopup(true);
               setTimeout(() => {
                  setShowPopup(false);
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.userData));
                  navigate('/dashboard');
                  setTimeout(() => {
                     window.location.reload();
                  }, 1000);
               }, 1800);
            } else {
               setPopupMessage("Invalid credentials");
               setShowPopup(true);
               setTimeout(() => setShowPopup(false), 2500);
            }
         })
         .catch((err) => {
            setPopupMessage("Invalid credentials");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2500);
         });
   };

   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand><h2>LearnHub</h2></Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav
                     className="me-auto my-2 my-lg-0"
                     style={{ maxHeight: '100px' }}
                     navbarScroll
                  >
                  </Nav>
                  <Nav style={{ marginLeft: 'auto', gap: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                     <Link to={'/'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn home-btn" variant="outline-dark" size="sm">Home</Button>
                        </motion.div>
                     </Link>
                     <Link to={'/login'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn home-btn" variant="outline-dark" size="sm">Login</Button>
                        </motion.div>
                     </Link>
                     <Link to={'/register'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="custom-btn register-btn" variant="outline-dark" size="sm">Register</Button>
                        </motion.div>
                     </Link>
                  </Nav>

               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className='first-container'>
            {/* Popup for login feedback */}
            {showPopup && (
               <div style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.18)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
                  <div style={{
                     background: popupMessage.toLowerCase().includes('success') ? 'linear-gradient(90deg, #43a047 0%, #b9f6ca 100%)' : 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)',
                     color: popupMessage.toLowerCase().includes('success') ? '#fff' : '#222',
                     fontWeight: 700,
                     fontSize: '1.1rem',
                     borderRadius: '16px',
                     padding: '28px 36px',
                     boxShadow: '0 4px 24px #ffe08299',
                     minWidth: 280,
                     textAlign: 'center',
                     position: 'relative',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: 8
                  }}>
                     {popupMessage.toLowerCase().includes('success') ? (
                        <span style={{fontSize: 28, color: '#fff', display: 'flex', alignItems: 'center'}}>
                           <i className="bi bi-check-circle-fill"></i>
                        </span>
                     ) : (
                        <span style={{fontSize: 22, marginRight: 8, color: '#ff5252'}}><i className="bi bi-x-octagon-fill"></i></span>
                     )}
                     <span>{popupMessage}</span>
                     <button onClick={() => setShowPopup(false)} style={{
                        position: 'absolute',
                        top: 8,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        color: popupMessage.toLowerCase().includes('success') ? '#fff' : '#ff5252',
                        cursor: 'pointer',
                     }} aria-label="Close popup">
                        ×
                     </button>
                  </div>
               </div>
            )}
            <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
               <Box
                  sx={{
                     marginTop: 8,
                     marginBottom: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     padding: '24px 16px',
                     background: 'rgba(255,255,255,0.45)',
                     border: '2px solid #ffb88c',
                     borderRadius: '18px',
                     boxShadow: '0 4px 24px rgba(255,126,95,0.08)',
                     fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                     minWidth: 260,
                     maxWidth: 320,
                     backdropFilter: 'blur(8px)',
                  }}
               >
                  <Avatar sx={{ bgcolor: '#ff7e5f', width: 56, height: 56, mb: 1 }}>
                     <span style={{ fontSize: 28, fontWeight: 700 }}>🔒</span>
                  </Avatar>
                  <Typography component="h1" variant="h5" sx={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', fontWeight: 700, color: '#ff7e5f', mb: 2 }}>
                     Sign In
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                        sx={{ mb: 2, background: '#fff', borderRadius: 2, border: errors.email ? '2px solid #ff5252' : undefined }}
                        error={!!errors.email}
                        InputProps={{
                           endAdornment: errors.email && (
                              <span style={{ color: '#ff5252', fontWeight: 600, marginLeft: 8, fontSize: 15, background: 'rgba(255,82,82,0.08)', borderRadius: 6, padding: '2px 10px' }}>
                                 <i className="bi bi-exclamation-circle-fill" style={{marginRight: 4}}></i>Required
                              </span>
                           )
                        }}
                        helperText={errors.email && ''}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        sx={{ mb: 2, background: '#fff', borderRadius: 2, border: errors.password ? '2px solid #ff5252' : undefined }}
                        error={!!errors.password}
                        InputProps={{
                           endAdornment: errors.password && (
                              <span style={{ color: '#ff5252', fontWeight: 600, marginLeft: 8, fontSize: 15, background: 'rgba(255,82,82,0.08)', borderRadius: 6, padding: '2px 10px' }}>
                                 <i className="bi bi-exclamation-circle-fill" style={{marginRight: 4}}></i>Required
                              </span>
                           )
                        }}
                        helperText={errors.password && ''}
                     />
                     <Box mt={2} display="flex" justifyContent="center">
                        <motion.div
                           initial={{ y: 60, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                           style={{ width: '100%' }}
                        >
                           <Button
                              type="submit"
                              variant="contained"
                              className="custom-btn"
                              style={{
                                 width: '200px',
                                 fontWeight: 600,
                                 fontSize: 18,
                                 background: 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)',
                                 color: '#222',
                                 border: 'none',
                                 boxShadow: '0 2px 8px #ffe08255',
                                 transition: 'background 0.3s',
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffe082 0%, #ffb300 100%)'}
                              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)'}
                           >
                              Sign In
                           </Button>
                        </motion.div>
                     </Box>
                     <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>Don't have an account?
                           <Link style={{ color: "#ff7e5f", fontWeight: 600 }} to={'/register'} variant="body2">
                              {" Sign Up"}
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </div>

      </>
   )
}

export default Login



