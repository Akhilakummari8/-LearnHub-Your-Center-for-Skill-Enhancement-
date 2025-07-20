import React, { useState } from 'react'
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
import Dropdown from 'react-bootstrap/Dropdown';
import { motion } from 'framer-motion';




const Register = () => {
   const navigate = useNavigate()
   const [selectedOption, setSelectedOption] = useState('Select User');
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   })
   const [greeting, setGreeting] = useState("");
   const [errors, setErrors] = useState({});
   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");
   const isDisabled = greeting !== "";

   const handleSelect = (eventKey) => {
      setSelectedOption(eventKey);
      setData({ ...data, type: eventKey });
      setErrors({ ...errors, type: '' });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      // Restrict special characters in name field
      if (name === 'name') {
         // Allow only letters and spaces
         const filtered = value.replace(/[^a-zA-Z\s]/g, '');
         setData({ ...data, [name]: filtered });
         setErrors({ ...errors, [name]: '' });
         return;
      }
      setData({ ...data, [name]: value });
      setErrors({ ...errors, [name]: '' });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      let newErrors = {};
      // Name validation: must not contain special characters
      if (!data.name) newErrors.name = 'Required field';
      else if (/[^a-zA-Z\s]/.test(data.name)) newErrors.name = 'Enter a valid name (no special characters)';
      if (!data.email) newErrors.email = 'Required field';
      else if (!/^\S+@gmail\.com$/.test(data.email)) newErrors.email = 'Must be a valid @gmail.com address';
      if (!data.password) newErrors.password = 'Required field';
      if (!data.type) newErrors.type = 'Required field';
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      axiosInstance.post('/api/user/register', data)
         .then((response) => {
            if (response.data.success) {
               setGreeting(`Welcome, ${data.name}! Registration successful.`);
               setTimeout(() => {
                  setGreeting("");
                  navigate('/login');
               }, 2500);
            } else {
               if (response.data.message && response.data.message.toLowerCase().includes('exist')) {
                  setPopupMessage(response.data.message);
                  setShowPopup(true);
                  setTimeout(() => setShowPopup(false), 2500);
               } else {
                  setGreeting(response.data.message);
               }
            }
         })
         .catch((error) => {
            setGreeting("Registration failed. Please try again.");
         });
   };

   // Password strength checker
   const getPasswordStrength = (password) => {
      if (!password) return '';
      // Strong: 8+ chars, upper, lower, number, special
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)) return 'Strong';
      // Medium: 6+ chars, at least two of upper/lower/number
      if (password.length >= 6 && ((/[A-Z]/.test(password) && /[a-z]/.test(password)) || (/[A-Z]/.test(password) && /\d/.test(password)) || (/[a-z]/.test(password) && /\d/.test(password)))) return 'Medium';
      // Weak: less than 6 or only one type
      return 'Weak';
   };

   const passwordStrength = getPasswordStrength(data.password);

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
         <div className="first-container">
            {/* Popup for user already exists */}
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
                     background: 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)',
                     color: '#222',
                     fontWeight: 700,
                     fontSize: '1.1rem',
                     borderRadius: '16px',
                     padding: '28px 36px',
                     boxShadow: '0 4px 24px #ffe08299',
                     minWidth: 280,
                     textAlign: 'center',
                     position: 'relative',
                  }}>
                     <span style={{fontSize: 22, marginRight: 8, color: '#ff5252'}}><i className="bi bi-x-octagon-fill"></i></span>
                     {popupMessage || 'User already exists'}
                     <button onClick={() => setShowPopup(false)} style={{
                        position: 'absolute',
                        top: 8,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        color: '#ff5252',
                        cursor: 'pointer',
                     }} aria-label="Close popup">
                        ×
                     </button>
                  </div>
               </div>
            )}
            {greeting && (
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
                     background: greeting.toLowerCase().includes('success') ? 'linear-gradient(90deg, #43a047 0%, #b9f6ca 100%)' : 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)',
                     color: greeting.toLowerCase().includes('success') ? '#fff' : '#222',
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
                     {greeting.toLowerCase().includes('success') ? (
                        <span style={{fontSize: 28, color: '#fff', display: 'flex', alignItems: 'center'}}>
                           <i className="bi bi-check-circle-fill"></i>
                        </span>
                     ) : (
                        <span style={{fontSize: 22, marginRight: 8, color: '#ff5252'}}><i className="bi bi-x-octagon-fill"></i></span>
                     )}
                     <span>{greeting}</span>
                     <button onClick={() => setGreeting("")} style={{
                        position: 'absolute',
                        top: 8,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        color: greeting.toLowerCase().includes('success') ? '#fff' : '#ff5252',
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
                     marginTop: 1,
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
                     minWidth: 300,
                     maxWidth: 370,
                     backdropFilter: 'blur(8px)',
                  }}
               >
                  <Avatar sx={{ bgcolor: '#ff7e5f', width: 56, height: 56, mb: 1 }}>
                     <span style={{ fontSize: 28, fontWeight: 700 }}>📝</span>
                  </Avatar>
                  <Typography component="h1" variant="h5" sx={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', fontWeight: 700, color: '#ff7e5f', mb: 2 }}>
                     Register
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        autoComplete="name"
                        autoFocus
                        sx={{ mb: 2, background: '#fff', borderRadius: 2, border: errors.name ? '2px solid #ff5252' : undefined }}
                        disabled={isDisabled}
                        error={!!errors.name}
                        InputProps={{
                           endAdornment: errors.name && (
                              <span style={{ color: '#ff5252', fontWeight: 600, marginLeft: 8, fontSize: 15, background: 'rgba(255,82,82,0.08)', borderRadius: 6, padding: '2px 10px' }}>
                                 <i className="bi bi-exclamation-circle-fill" style={{marginRight: 4}}></i>Required
                              </span>
                           )
                        }}
                        helperText={errors.name && ''}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        sx={{ mb: 2, background: '#fff', borderRadius: 2, border: errors.email ? '2px solid #ff5252' : undefined }}
                        disabled={isDisabled}
                        error={!!errors.email}
                        helperText={errors.email && errors.email}
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
                        disabled={isDisabled}
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
                     {data.password && (
                        <Box sx={{ width: '100%', mt: -1, mb: 1.5 }}>
                           <Box sx={{ height: 8, borderRadius: 4, background: '#eee', overflow: 'hidden', mb: 0.5 }}>
                              <Box sx={{
                                 height: '100%',
                                 width: passwordStrength === 'Strong' ? '100%' : passwordStrength === 'Medium' ? '66%' : '33%',
                                 background: passwordStrength === 'Strong' ? '#43a047' : passwordStrength === 'Medium' ? '#ffa000' : '#ff5252',
                                 transition: 'width 0.3s, background 0.3s',
                                 borderRadius: 4
                              }} />
                           </Box>
                           <Typography sx={{ fontWeight: 600, fontSize: 14, color: passwordStrength === 'Strong' ? '#43a047' : passwordStrength === 'Medium' ? '#ffa000' : '#ff5252', textAlign: 'right', letterSpacing: 1 }}>
                              {passwordStrength}
                           </Typography>
                        </Box>
                     )}
                     <Dropdown className='my-3'>
                        <Dropdown.Toggle 
                           variant="warning" 
                           id="dropdown-basic"
                           style={{ minWidth: '180px', fontWeight: 600, color: '#222', background: '#ffe082', border: errors.type ? '2px solid #ff5252' : 'none', boxShadow: '0 2px 8px #ffe08255' }}
                           disabled={isDisabled}
                        >
                           {selectedOption}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           <Dropdown.Item onClick={() => handleSelect("Student")}>Student</Dropdown.Item>
                           <Dropdown.Item onClick={() => handleSelect("Teacher")}>Teacher</Dropdown.Item>
                           <Dropdown.Item 
                              onClick={() => {
                                 if (data.email === 'admin@gmail.com' && data.password === 'admin143') {
                                    handleSelect("Admin");
                                 }
                              }}
                              disabled={!(data.email === 'admin@gmail.com' && data.password === 'admin143')}
                              style={{ color: (data.email === 'admin@gmail.com' && data.password === 'admin143') ? '#222' : '#aaa' }}
                           >Admin</Dropdown.Item>
                        </Dropdown.Menu>
                        {errors.type && <div style={{ color: '#ff5252', fontWeight: 600, marginTop: 4, marginLeft: 2, fontSize: 15, background: 'rgba(255,82,82,0.08)', borderRadius: 6, padding: '2px 10px', display: 'inline-flex', alignItems: 'center' }}><i className="bi bi-exclamation-circle-fill" style={{marginRight: 4}}></i>Required</div>}
                     </Dropdown>
                     <Box mt={2} display="flex" justifyContent="center">
                        <motion.div
                           initial={{ y: 60, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
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
                                 boxShadow: '0 6px 24px #ffe08299',
                                 transition: 'background 0.3s',
                                 letterSpacing: 1.5,
                                 borderRadius: 12,
                                 textTransform: 'uppercase',
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffe082 0%, #ffb300 100%)'}
                              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb300 0%, #ffe082 100%)'}
                              disabled={isDisabled}
                           >
                              <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
                                <i className="bi bi-person-plus-fill" style={{fontSize:22, color:'#ff7e5f'}}></i>
                                Sign Up
                              </span>
                           </Button>
                        </motion.div>
                     </Box>
                     <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>Have an account?
                           <Link style={{ color: "#ff7e5f", fontWeight: 600 }} to={'/login'} variant="body2">
                              {" Sign In"}
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
            {/* Display error summary at the bottom of the box */}
            {Object.values(errors).some(Boolean) && (
               <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ background: 'rgba(255,82,82,0.08)', color: '#ff5252', borderRadius: 2, px: 3, py: 2, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #ff525255', minWidth: 260, textAlign: 'center' }}>
                     {Object.entries(errors).map(([key, val]) => val && <div key={key}>{val}</div>)}
                  </Box>
               </Box>
            )}
         </div>

      </>
   )
}

export default Register


