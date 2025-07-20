import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AllCourses = ({ trendingOnly }) => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');
   const [loading, setLoading] = useState(true);

   const [showModal, setShowModal] = useState(Array(allCourses.length).fill(false));
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })

   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");
   const [popupType, setPopupType] = useState("success");
   const [formErrors, setFormErrors] = useState({});

   // --- Backend enrolled courses state ---
   const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

   useEffect(() => {
      // Fetch enrolled courses for the logged-in student
      const fetchEnrolledCourses = async () => {
         try {
            const res = await axiosInstance.get('api/user/enrolledcourses', {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            });
            if (res.data.success && Array.isArray(res.data.data)) {
               setEnrolledCourseIds(res.data.data.map(c => c._id));
            }
         } catch (error) {
            // Ignore error, fallback to localStorage only
         }
      };
      if (user && user.userLoggedIn) fetchEnrolledCourses();
   }, [user]);

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }

   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice == 'free') {
         handleSubmit(courseId)
         return navigate(`/courseSection/${courseId}/${courseTitle}`)
      } else {
         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };

   // Function to handle closing the modal for a specific course
   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
      // Reset form
      setCardDetails({
         cardholdername: '',
         cardnumber: '',
         cvvcode: '',
         expmonthyear: '',
      });
      setFormErrors({});
   };

   const getAllCoursesUser = async () => {
      try {
         setLoading(true);
         const res = await axiosInstance.get(`api/user/getallcourses`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
         setPopupMessage('Failed to load courses. Please try again.');
         setPopupType('error');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 3000);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const isPaidCourse = (course) => {
      // Check if C_price contains a number
      return /\d/.test(course.C_price);
   };

   // Utility to check if course is purchased or enrolled
   const isCoursePurchased = (courseId) => {
      const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
      // Check both localStorage and backend-enrolled courses
      return purchased.includes(courseId) || enrolledCourseIds.includes(courseId);
   };

   // Update purchased courses in localStorage after purchase
   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            // Mark as purchased
            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
            if (!purchased.includes(courseId)) {
               purchased.push(courseId);
               localStorage.setItem('purchasedCourses', JSON.stringify(purchased));
            }
            setPopupMessage('🎉 Successfully enrolled! Redirecting to course...');
            setPopupType('success');
            setShowPopup(true);
            setShowModal(Array(allCourses.length).fill(false)); // Close all modals
            setTimeout(() => {
               setShowPopup(false);
               navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
            }, 2000);
         } else {
            setPopupMessage(res.data.message);
            setPopupType('info');
            setShowPopup(true);
            setTimeout(() => {
               setShowPopup(false);
               navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
            }, 2000);
         }
      } catch (error) {
         setPopupMessage('An error occurred. Please try again.');
         setPopupType('error');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 3000);
      }
   }

   const validateCardDetails = () => {
      const errors = {};
      // Card Holder Name: only letters and spaces
      if (!/^[A-Za-z ]+$/.test(cardDetails.cardholdername.trim())) {
         errors.cardholdername = 'Name must contain only letters';
      }
      // Card Number: only numbers, exactly 16 digits
      if (!/^\d{16}$/.test(cardDetails.cardnumber)) {
         errors.cardnumber = 'Please enter a valid 16-digit card number';
      }
      // Expiration: MM/YYYY, month 01-12, year 4 digits
      if (!/^\d{2}\/\d{4}$/.test(cardDetails.expmonthyear)) {
         errors.expmonthyear = 'Format must be MM/YYYY';
     
         const [mm, yyyy] = cardDetails.expmonthyear.split('/');
         if (parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) {
            errors.expmonthyear = 'Month must be between 01 and 12';
         }
         if (mm.length !== 2) {
            errors.expmonthyear = 'Month must be two digits (e.g., 01)';
         }
         if (yyyy.length !== 4) {
            errors.expmonthyear = 'Year must be four digits';
         }
      }
      // CVV: only 3 digits
      if (!/^\d{3}$/.test(cardDetails.cvvcode)) {
         errors.cvvcode = 'CVV must be 3 digits';
      }
      return errors;
   };

   const handleCardInput = (e) => {
      const { name, value } = e.target;
      let newValue = value;
      if (name === 'cardholdername') {
         newValue = newValue.replace(/[^A-Za-z ]/g, '');
      }
      if (name === 'cardnumber') {
         newValue = newValue.replace(/[^\d]/g, '').slice(0, 16);
      }
      if (name === 'cvvcode') {
         newValue = value.replace(/[^\d]/g, '').slice(0, 3);
      }
      if (name === 'expmonthyear') {
         let digits = newValue.replace(/[^\d]/g, '');
         if (digits.length === 1 && digits > '1') {
            // If user types 3-9 as first digit, auto-pad with 0
            digits = '0' + digits;
         }
         if (digits.length > 4) digits = digits.slice(0, 6);
         if (digits.length > 2) {
            let mm = digits.slice(0, 2);
            if (parseInt(mm, 10) > 12) mm = '12';
            newValue = mm + '/' + digits.slice(2, 6);
         } else {
            newValue = digits;
         }
      }
      setCardDetails({ ...cardDetails, [name]: newValue });
      // Clear error when user starts typing
      if (formErrors[name]) {
         setFormErrors({ ...formErrors, [name]: '' });
      }
   };

   const handlePaymentSubmit = (e, courseId) => {
      e.preventDefault();
      const errors = validateCardDetails();
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;
      handleSubmit(courseId);
   };

   const filteredCourses = allCourses
      .filter(
         (course) =>
            filterTitle === '' ||
            course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
      )
      .filter((course) => {
         if (filterType === 'Free') {
            return !isPaidCourse(course);
         } else if (filterType === 'Paid') {
            return isPaidCourse(course);
         } else {
            return true;
         }
      })
      .filter((course, idx) => !trendingOnly || idx < 6); // Show only top 6 if trendingOnly

   if (loading) {
      return (
         <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
            <div className="text-center">
               <Spinner animation="border" variant="primary" style={{width: '3rem', height: '3rem'}} />
               <div className="mt-3" style={{fontSize: '1.2rem', fontWeight: 600, color: '#667eea'}}>
                  Loading amazing courses...
               </div>
            </div>
         </div>
      );
   }

   return (
      <>
         {/* Enhanced Popup for course feedback */}
         {showPopup && (
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
                     padding: '30px 40px',
                     boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                     minWidth: 350,
                     textAlign: 'center',
                     position: 'relative',
                     border: `3px solid ${popupType === 'success' ? '#28a745' : popupType === 'error' ? '#dc3545' : '#17a2b8'}`,
                  }}
               >
                  <div style={{
                     background: `linear-gradient(45deg, ${popupType === 'success' ? '#28a745, #20c997' : popupType === 'error' ? '#dc3545, #fd7e14' : '#17a2b8, #6f42c1'})`,
                     borderRadius: '50%',
                     width: '60px',
                     height: '60px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     margin: '0 auto 15px auto'
                  }}>
                     <i className={`bi ${popupType === 'success' ? 'bi-check-lg' : popupType === 'error' ? 'bi-x-lg' : 'bi-info-lg'}`} 
                        style={{fontSize: '1.5rem', color: 'white'}}></i>
                  </div>
                  {popupMessage}
                  <button onClick={() => setShowPopup(false)} style={{
                     position: 'absolute',
                     top: 10,
                     right: 15,
                     background: 'none',
                     border: 'none',
                     fontSize: 24,
                     color: '#999',
                     cursor: 'pointer',
                     transition: 'color 0.3s ease'
                  }} 
                  onMouseOver={e => e.target.style.color = '#dc3545'}
                  onMouseOut={e => e.target.style.color = '#999'}
                  aria-label="Close popup">
                     ×
                  </button>
               </motion.div>
            </div>
         )}

         {!trendingOnly && (
            <motion.div 
               className="filter-container text-center"
               initial={{ opacity: 0, y: -30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               <div style={{marginBottom: '15px'}}>
                  <h5 style={{color: 'white', fontWeight: 700, marginBottom: '20px'}}>
                     <i className="bi bi-search me-2"></i>Find Your Perfect Course
                  </h5>
               </div>
               <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
                  <input
                     type="text"
                     placeholder="🔍 Search by course title..."
                     value={filterTitle}
                     onChange={(e) => setFilterTitle(e.target.value)}
                     style={{ 
                        width: '350px', 
                        maxWidth: '90%', 
                        padding: '12px 20px', 
                        fontSize: '1rem', 
                        borderRadius: '25px', 
                        border: '2px solid rgba(255,255,255,0.3)', 
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                     }}
                     onFocus={e => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                     }}
                     onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                     }}
                  />
                  <select 
                     value={filterType} 
                     onChange={(e) => setFilterType(e.target.value)}
                     style={{
                        padding: '12px 20px',
                        borderRadius: '25px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 500,
                        minWidth: '150px',
                        transition: 'all 0.3s ease'
                     }}
                     onFocus={e => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                     }}
                     onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.target.style.boxShadow = 'none';
                     }}
                  >
                     <option value="">All Courses</option>
                     <option value="Free">🆓 Free Courses</option>
                     <option value="Paid">💎 Premium Courses</option>
                  </select>
               </div>
            </motion.div>
         )}

         <div className='course-container'>
            {filteredCourses?.length > 0 ? (
               filteredCourses.map((course, index) => (
                  <motion.div 
                     key={course._id} 
                     className='course trending-course-card'
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                     <div className="card1">
                        <div className="desc">
                           <div style={{marginBottom: '20px'}}>
                              <h4 style={{color: 'white', fontWeight: 700, marginBottom: '15px'}}>
                                 <i className="bi bi-play-circle-fill me-2"></i>Course Modules
                              </h4>
                              {Array.isArray(course.sections) && course.sections.length > 0 ? (
                                 course.sections.slice(0, 2).map((section, i) => (
                                    <div key={i} style={{
                                       background: 'rgba(255,255,255,0.13)',
                                       borderRadius: '14px',
                                       padding: '14px',
                                       marginBottom: '12px',
                                       boxShadow: '0 2px 8px #667eea22',
                                       display: 'flex',
                                       alignItems: 'flex-start',
                                       gap: 12
                                    }}>
                                       <div style={{marginTop: 2}}>
                                          <i className="bi bi-bookmark-fill me-2" style={{color: '#ffc107', fontSize: '1.2rem'}}></i>
                                       </div>
                                       <div>
                                          <div style={{fontWeight: 700, fontSize: '1.05rem', color: '#333', marginBottom: 2}}>{section.S_title}</div>
                                          <div style={{fontSize: '0.93rem', color: '#555', opacity: 0.92}}>
                                             {section.S_description ? section.S_description.slice(0, 50) : ''}...
                                          </div>
                                       </div>
                                    </div>
                                 ))
                              ) : (
                                 <div style={{
                                    background: 'rgba(255,255,255,0.13)',
                                    borderRadius: '14px',
                                    padding: '18px',
                                    textAlign: 'center',
                                    color: '#888',
                                    fontWeight: 600
                                 }}>
                                    <i className="bi bi-hourglass-split" style={{fontSize: '1.5rem', marginBottom: '10px', display: 'block'}}></i>
                                    <span style={{fontSize: '0.97rem'}}>Course content coming soon!</span>
                                 </div>
                              )}
                              {course.sections.length > 2 && (
                                 <div style={{
                                    textAlign: 'center',
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '10px'
                                 }}>
                                    <p style={{margin: 0, fontWeight: 600, fontSize: '1rem'}}>
                                       <i className="bi bi-plus-circle-fill me-2"></i>
                                       +{course.sections.length - 2} more modules to explore!
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div className="details">
                           <div className="center">
                              <div style={{marginBottom: '20px'}}>
                                 <h1 style={{marginBottom: '10px'}}>
                                    <span className="course-title-ellipsis">{course.C_title}</span>
                                 </h1>
                                 <div style={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: 'white',
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    display: 'inline-block',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    marginBottom: '10px'
                                 }}>
                                    {course.C_categories}
                                 </div>
                                 <p style={{fontSize: '0.9rem', color: '#666', margin: '5px 0'}}>
                                    <i className="bi bi-person-fill me-1"></i>
                                    by <strong>{course.C_educator}</strong>
                                 </p>
                              </div>

                              <div style={{marginBottom: '20px'}}>
                                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <span style={{fontSize: '0.9rem', color: '#666'}}>
                                       <i className="bi bi-collection-play me-1"></i>Modules:
                                    </span>
                                    <span style={{fontWeight: 600, color: '#667eea'}}>{course.sections.length}</span>
                                 </div>
                                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <span style={{fontSize: '0.9rem', color: '#666'}}>
                                       <i className="bi bi-currency-dollar me-1"></i>Price:
                                    </span>
                                    <span style={{
                                       fontWeight: 700, 
                                       color: course.C_price === 'free' ? '#28a745' : '#dc3545',
                                       fontSize: '1.1rem'
                                    }}>
                                       {course.C_price === 'free' ? 'FREE' : `₹${course.C_price}`}
                                    </span>
                                 </div>
                                 <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{fontSize: '0.9rem', color: '#666'}}>
                                       <i className="bi bi-people-fill me-1"></i>Students:
                                    </span>
                                    <span style={{fontWeight: 600, color: '#17a2b8'}}>{course.enrolled}</span>
                                 </div>
                              </div>

                              {user.userLoggedIn === true ? (
                                 <>
                                    {isCoursePurchased(course._id) || enrolledCourseIds.includes(course._id) ? (
                                       <Button
                                          className="btn btn-success"
                                          size='sm'
                                          onClick={() => navigate(`/courseSection/${course._id}/${course.C_title}`)}
                                          style={{
                                             borderRadius: '25px',
                                             padding: '10px 25px',
                                             fontWeight: 600,
                                             fontSize: '0.9rem',
                                             width: '100%'
                                          }}
                                       >
                                          <i className="bi bi-play-fill me-2"></i>Continue Learning
                                       </Button>
                                    ) : (
                                       <Button
                                          className="btn"
                                          size='sm'
                                          onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                                          style={{
                                             background: course.C_price === 'free' ? 'linear-gradient(45deg, #28a745, #20c997)' : 'linear-gradient(45deg, #667eea, #764ba2)',
                                             border: 'none',
                                             borderRadius: '25px',
                                             padding: '10px 25px',
                                             fontWeight: 600,
                                             fontSize: '0.9rem',
                                             width: '100%',
                                             color: 'white'
                                          }}
                                       >
                                          <i className={`bi ${course.C_price === 'free' ? 'bi-download' : 'bi-cart-plus'} me-2`}></i>
                                          {course.C_price === 'free' ? 'Enroll Free' : 'Enroll Now'}
                                       </Button>
                                    )}
                                    
                                    {/* Enhanced Payment Modal */}
                                    <Modal 
                                       show={showModal[index]} 
                                       onHide={() => handleClose(index)} 
                                       dialogClassName="payment-modal"
                                       centered
                                    >
                                       <Modal.Header closeButton>
                                          <Modal.Title>
                                             <i className="bi bi-credit-card-fill me-2"></i>
                                             Secure Payment
                                          </Modal.Title>
                                       </Modal.Header>
                                       <Modal.Body>
                                          <div style={{marginBottom: '25px', textAlign: 'center'}}>
                                             <div style={{
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                borderRadius: '15px',
                                                padding: '20px',
                                                color: 'white',
                                                marginBottom: '20px'
                                             }}>
                                                <h5 style={{margin: 0, fontWeight: 700}}>{course.C_title}</h5>
                                                <p style={{margin: '5px 0 0 0', opacity: 0.9}}>by {course.C_educator}</p>
                                                <div style={{
                                                   fontSize: '1.5rem',
                                                   fontWeight: 800,
                                                   marginTop: '10px'
                                                }}>
                                                   ₹{course.C_price}
                                                </div>
                                             </div>
                                          </div>
                                          
                                          <Form onSubmit={(e) => handlePaymentSubmit(e, course._id)}>
                                             <Form.Group className="mb-3">
                                                <Form.Label style={{fontWeight: 600, color: '#333'}}>
                                                   <i className="bi bi-person-fill me-2"></i>Cardholder Name
                                                </Form.Label>
                                                <Form.Control 
                                                   name='cardholdername' 
                                                   value={cardDetails.cardholdername} 
                                                   onChange={handleCardInput} 
                                                   type="text" 
                                                   placeholder="Enter cardholder's full name" 
                                                   required 
                                                   isInvalid={!!formErrors.cardholdername}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                   {formErrors.cardholdername}
                                                </Form.Control.Feedback>
                                             </Form.Group>
                                             
                                             <Form.Group className="mb-3">
                                                <Form.Label style={{fontWeight: 600, color: '#333'}}>
                                                   <i className="bi bi-credit-card me-2"></i>Card Number
                                                </Form.Label>
                                                <Form.Control 
                                                   name='cardnumber' 
                                                   value={cardDetails.cardnumber} 
                                                   onChange={handleCardInput} 
                                                   type="text" 
                                                   inputMode="numeric" 
                                                   placeholder="1234 5678 9012 3456" 
                                                   required 
                                                   isInvalid={!!formErrors.cardnumber}
                                                   maxLength={16}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                   {formErrors.cardnumber}
                                                </Form.Control.Feedback>
                                             </Form.Group>
                                             
                                             <div className="row">
                                                <div className="col-md-6">
                                                   <Form.Group className="mb-3">
                                                      <Form.Label style={{fontWeight: 600, color: '#333'}}>
                                                         <i className="bi bi-calendar-event me-2"></i>Expiry Date
                                                      </Form.Label>
                                                      <Form.Control 
                                                         name='expmonthyear' 
                                                         value={cardDetails.expmonthyear} 
                                                         onChange={handleCardInput} 
                                                         type="text" 
                                                         placeholder="MM/YYYY" 
                                                         required 
                                                         isInvalid={!!formErrors.expmonthyear}
                                                         maxLength={7}
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                         {formErrors.expmonthyear}
                                                      </Form.Control.Feedback>
                                                   </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                   <Form.Group className="mb-3">
                                                      <Form.Label style={{fontWeight: 600, color: '#333'}}>
                                                         <i className="bi bi-shield-lock me-2"></i>CVV
                                                      </Form.Label>
                                                      <Form.Control 
                                                         name='cvvcode' 
                                                         value={cardDetails.cvvcode} 
                                                         onChange={handleCardInput} 
                                                         type="password" 
                                                         inputMode="numeric" 
                                                         placeholder="123" 
                                                         required 
                                                         isInvalid={!!formErrors.cvvcode}
                                                         maxLength={3}
                                                      />
                                                      <Form.Control.Feedback type="invalid">
                                                         {formErrors.cvvcode}
                                                      </Form.Control.Feedback>
                                                   </Form.Group>
                                                </div>
                                             </div>
                                             
                                             <Alert variant="info" style={{borderRadius: '12px', border: 'none'}}>
                                                <i className="bi bi-shield-check me-2"></i>
                                                <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                                             </Alert>
                                             
                                             <div className="d-flex justify-content-end gap-3 mt-4">
                                                <Button 
                                                   variant="outline-secondary" 
                                                   onClick={() => handleClose(index)}
                                                   style={{borderRadius: '12px', padding: '10px 20px', fontWeight: 600}}
                                                >
                                                   <i className="bi bi-x-lg me-2"></i>Cancel
                                                </Button>
                                                <Button 
                                                   type='submit'
                                                   style={{
                                                      background: 'linear-gradient(45deg, #28a745, #20c997)',
                                                      border: 'none',
                                                      borderRadius: '12px',
                                                      padding: '10px 25px',
                                                      fontWeight: 600,
                                                      color: 'white'
                                                   }}
                                                >
                                                   <i className="bi bi-credit-card me-2"></i>Pay ₹{course.C_price}
                                                </Button>
                                             </div>
                                          </Form>
                                       </Modal.Body>
                                    </Modal>
                                 </>
                              ) : (
                                 <Link to={'/login'}>
                                    <Button
                                       className="btn"
                                       size='sm'
                                       style={{
                                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                          border: 'none',
                                          borderRadius: '25px',
                                          padding: '10px 25px',
                                          fontWeight: 600,
                                          fontSize: '0.9rem',
                                          width: '100%',
                                          color: 'white'
                                       }}
                                    >
                                       <i className="bi bi-box-arrow-in-right me-2"></i>Login to Enroll
                                    </Button>
                                 </Link>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))
            ) : (
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                     gridColumn: '1 / -1',
                     textAlign: 'center',
                     padding: '60px 20px',
                     background: 'rgba(255, 255, 255, 0.1)',
                     borderRadius: '20px',
                     backdropFilter: 'blur(10px)',
                     border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
               >
                  <i className="bi bi-search" style={{fontSize: '4rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px', display: 'block'}}></i>
                  <h4 style={{color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: '10px'}}>
                     No courses found
                  </h4>
                  <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem'}}>
                     Try adjusting your search criteria or check back later for new courses!
                  </p>
               </motion.div>
            )}
         </div>
      </>
   );
};

export default AllCourses;