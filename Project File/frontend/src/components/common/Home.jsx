import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AllCourses from './AllCourses';
import bgImg from '../../assets/Images/bg.jpg';

const Home = () => {
   return (
      <>
         <Navbar expand="lg" className="navbar" sticky="top" style={{zIndex: 1000}}>
            <Container fluid>
               <Navbar.Brand>
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6 }}
                     style={{display:'flex', alignItems:'center', gap:'15px'}}
                  >
                     <i className="bi bi-mortarboard-fill" style={{fontSize:'2.5rem', color:'#667eea'}}></i>
                     <h2 style={{fontWeight:'800', letterSpacing:'2px', margin:0, background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>LearnHub</h2>
                  </motion.div>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav
                     className="me-auto my-2 my-lg-0"
                     style={{ maxHeight: '100px' }}
                     navbarScroll
                  >
                  </Nav>
                  <Nav style={{gap: '10px'}}>
                     <Link to={'/'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="btn btn-outline-primary" size="sm">
                              <i className="bi bi-house-fill me-2"></i>Home
                           </Button>
                        </motion.div>
                     </Link>
                     <Link to={'/login'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="btn btn-outline-success" size="sm">
                              <i className="bi bi-box-arrow-in-right me-2"></i>Login
                           </Button>
                        </motion.div>
                     </Link>
                     <Link to={'/register'}>
                        <motion.div
                           initial={{ x: -100, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                        >
                           <Button className="btn btn-warning" size="sm">
                              <i className="bi bi-person-plus-fill me-2"></i>Register
                           </Button>
                        </motion.div>
                     </Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         {/* Hero Section */}
         <div id='home-container' className='first-container' style={{
            background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)), url(${bgImg}) center/cover no-repeat`,
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
         }}>
            <Container>
               <Row className="justify-content-center text-center">
                  <Col lg={10}>
                     <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                     >
                        <h1 style={{
                           fontWeight:'800', 
                           fontSize:'3.5rem', 
                           letterSpacing:'2px',
                           textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                           marginBottom: '20px'
                        }}>
                           Transform Your Future with 
                           <span style={{color:'#667eea'}}> LearnHub</span>
                        </h1>
                        <h4 className="mb-4" style={{
                           fontWeight:400, 
                           color:'#f8f9fa',
                           fontSize: '1.5rem',
                           textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}>
                           Unlock Your Potential with Expert-Led Courses
                        </h4>
                        <motion.div
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 0.5, duration: 0.6 }}
                        >
                           <p style={{
                              fontSize: '1.2rem',
                              maxWidth: '700px',
                              margin: '0 auto 30px auto',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '20px',
                              padding: '25px 35px',
                              color: '#f8f9fa',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              lineHeight: '1.6'
                           }}>
                              Join <span style={{color:'#667eea', fontWeight:'bold'}}>thousands of learners</span> worldwide and 
                              <span style={{color:'#764ba2', fontWeight:'bold'}}> master new skills</span> with our 
                              <span style={{color:'#667eea', fontWeight:'bold'}}> interactive courses</span>, 
                              <span style={{color:'#764ba2', fontWeight:'bold'}}> expert instructors</span>, and 
                              <span style={{color:'#667eea', fontWeight:'bold'}}> supportive community</span>.
                           </p>
                        </motion.div>
                        <motion.div
                           initial={{ y: 60, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.8, duration: 0.6 }}
                           style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                           <Link to={'/register'}>
                              <Button 
                                 size='lg' 
                                 style={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    border: 'none',
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    borderRadius: '50px',
                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                    transition: 'all 0.3s ease'
                                 }}
                                 onMouseOver={e => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
                                 }}
                                 onMouseOut={e => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                                 }}
                              >
                                 <i className="bi bi-rocket-takeoff me-2"></i>
                                 Start Learning Today
                              </Button>
                           </Link>
                           <Link to={'/login'}>
                              <Button 
                                 variant="outline-light"
                                 size='lg' 
                                 style={{
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    transition: 'all 0.3s ease'
                                 }}
                                 onMouseOver={e => {
                                    e.target.style.background = 'white';
                                    e.target.style.color = '#667eea';
                                    e.target.style.transform = 'translateY(-3px)';
                                 }}
                                 onMouseOut={e => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'translateY(0)';
                                 }}
                              >
                                 <i className="bi bi-play-circle me-2"></i>
                                 Explore Courses
                              </Button>
                           </Link>
                        </motion.div>
                     </motion.div>
                  </Col>
               </Row>
            </Container>
         </div>

         {/* Features Section */}
         <Container className="my-5 py-5">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
            >
               <h2 className="text-center mb-5" style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#667eea',
                  textShadow: '2px 2px 4px rgba(102, 126, 234, 0.1)'
               }}>
                  Why Choose LearnHub?
               </h2>
               <Row className="g-4">
                  {[
                     {
                        icon: 'bi-lightbulb-fill',
                        title: 'Expert Instructors',
                        description: 'Learn from industry professionals with years of real-world experience and proven expertise.',
                        color: '#667eea',
                        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     },
                     {
                        icon: 'bi-laptop',
                        title: 'Flexible Learning',
                        description: 'Study at your own pace, anywhere, anytime. Access courses on any device with lifetime access.',
                        color: '#28a745',
                        gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                     },
                     {
                        icon: 'bi-people-fill',
                        title: 'Community Support',
                        description: 'Join a vibrant community of learners, get help when needed, and network with peers.',
                        color: '#17a2b8',
                        gradient: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)'
                     },
                     {
                        icon: 'bi-award-fill',
                        title: 'Certificates',
                        description: 'Earn industry-recognized certificates upon course completion to boost your career prospects.',
                        color: '#ffc107',
                        gradient: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
                     },
                     {
                        icon: 'bi-graph-up-arrow',
                        title: 'Track Progress',
                        description: 'Monitor your learning journey with detailed progress tracking and performance analytics.',
                        color: '#dc3545',
                        gradient: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
                     },
                     {
                        icon: 'bi-shield-check-fill',
                        title: 'Quality Assured',
                        description: 'All courses are carefully curated and regularly updated to ensure the highest quality content.',
                        color: '#6f42c1',
                        gradient: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'
                     }
                  ].map((feature, index) => (
                     <Col md={6} lg={4} key={index}>
                        <motion.div
                           initial={{ opacity: 0, y: 30 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: index * 0.1 }}
                           viewport={{ once: true }}
                        >
                           <Card className="h-100 border-0 shadow-lg" style={{
                              borderRadius: '20px',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                           }}
                           onMouseOver={e => {
                              e.currentTarget.style.transform = 'translateY(-10px)';
                              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                           }}
                           onMouseOut={e => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                           }}>
                              <div style={{
                                 background: feature.gradient,
                                 height: '5px'
                              }}></div>
                              <Card.Body className="text-center p-4">
                                 <div style={{
                                    background: feature.gradient,
                                    borderRadius: '50%',
                                    width: '80px',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px auto',
                                    boxShadow: `0 8px 25px ${feature.color}33`
                                 }}>
                                    <i className={feature.icon} style={{fontSize:'2.5rem', color:'white'}}></i>
                                 </div>
                                 <Card.Title style={{
                                    fontWeight:'700', 
                                    color: feature.color,
                                    fontSize: '1.3rem',
                                    marginBottom: '15px'
                                 }}>
                                    {feature.title}
                                 </Card.Title>
                                 <Card.Text style={{
                                    color:'#666', 
                                    fontSize:'1rem',
                                    lineHeight: '1.6'
                                 }}>
                                    {feature.description}
                                 </Card.Text>
                              </Card.Body>
                           </Card>
                        </motion.div>
                     </Col>
                  ))}
               </Row>
            </motion.div>
         </Container>

         {/* Trending Courses Section */}
         <div style={{background: 'rgba(255, 255, 255, 0.05)', padding: '60px 0'}}>
            <Container>
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
               >
                  <h2 className="trending-title text-center mb-5">
                     🔥 Trending Courses
                  </h2>
                  <div className="trending-courses-box">
                     <AllCourses 
                        trendingOnly={true} 
                        emptyMessage={
                           <div style={{
                              textAlign:'center', 
                              color:'rgba(255,255,255,0.8)', 
                              fontWeight:'600', 
                              fontSize:'1.3rem', 
                              padding:'50px 20px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '15px',
                              backdropFilter: 'blur(10px)'
                           }}>
                              <i className="bi bi-hourglass-split" style={{fontSize: '3rem', marginBottom: '20px', display: 'block'}}></i>
                              No trending courses available at the moment.
                              <br />
                              <small style={{fontSize: '1rem', opacity: 0.8}}>Check back soon for exciting new content!</small>
                           </div>
                        } 
                     />
                  </div>
               </motion.div>
            </Container>
         </div>

         {/* Call to Action Section */}
         <Container className="my-5 py-5">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
            >
               <Row className="justify-content-center">
                  <Col lg={8} className="text-center">
                     <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '25px',
                        padding: '50px 40px',
                        color: 'white',
                        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)'
                     }}>
                        <h3 style={{fontSize: '2.2rem', fontWeight: '800', marginBottom: '20px'}}>
                           Ready to Start Your Learning Journey?
                        </h3>
                        <p style={{fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9}}>
                           Join thousands of students who have already transformed their careers with LearnHub.
                           Start learning today and unlock your potential!
                        </p>
                        <Link to={'/register'}>
                           <Button 
                              size="lg"
                              style={{
                                 background: 'white',
                                 color: '#667eea',
                                 border: 'none',
                                 padding: '15px 40px',
                                 fontSize: '18px',
                                 fontWeight: '700',
                                 borderRadius: '50px',
                                 transition: 'all 0.3s ease',
                                 display: 'inline-flex',
                                 alignItems: 'center',
                                 gap: '10px',
                                 minWidth: '200px',
                                 justifyContent: 'center',
                                 overflow: 'visible',
                                 whiteSpace: 'nowrap',
                                 boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                              }}
                              onMouseOver={e => {
                                 e.currentTarget.style.transform = 'translateY(-3px)';
                                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                                 e.currentTarget.style.background = '#f5f7ff';
                              }}
                              onMouseOut={e => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
                                 e.currentTarget.style.background = 'white';
                              }}
                           >
                              <i className="bi bi-arrow-right-circle-fill me-2" style={{fontSize:'1.5rem', color:'#667eea'}}></i>
                              <span style={{fontWeight:'700',fontSize:'18px', color:'#667eea'}}>Get Started Now</span>
                           </Button>
                        </Link>
                     </div>
                  </Col>
               </Row>
            </motion.div>
         </Container>
      </>
   )
}

export default Home