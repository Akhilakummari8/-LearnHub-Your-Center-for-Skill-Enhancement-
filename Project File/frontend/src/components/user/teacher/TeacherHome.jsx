import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

const TeacherHome = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [allCourses, setAllCourses] = useState([]);
   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");
   const [popupType, setPopupType] = useState("success"); // 'success' | 'error' | 'info'
   const [showSectionForm, setShowSectionForm] = useState(null); // courseId or null
   const [newSection, setNewSection] = useState({ S_title: '', S_description: '', S_content: null });
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [pendingDeleteId, setPendingDeleteId] = useState(null);
   const [showLogoutModal, setShowLogoutModal] = useState(false);

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, [location]);

   const toggleDescription = (courseId) => {
      setAllCourses((prevCourses) =>
         prevCourses.map((course) =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const deleteCourse = async (courseId) => {
      setPendingDeleteId(courseId);
      setShowDeleteModal(true);
   };
   const confirmDeleteCourse = async () => {
      const courseId = pendingDeleteId;
      setShowDeleteModal(false);
      setPendingDeleteId(null);
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            setPopupMessage('Course deleted successfully.');
            setPopupType('success');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2200);
            getAllCoursesUser();
         } else {
            setPopupMessage('Failed to delete the course. Please try again.');
            setPopupType('error');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2200);
         }
      } catch (error) {
         setPopupMessage('An error occurred while deleting the course.');
         setPopupType('error');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 2200);
      }
   }

   const handleSectionChange = (e) => {
      const { name, value, files } = e.target;
      setNewSection((prev) => ({
         ...prev,
         [name]: files ? files[0] : value,
      }));
   };

   const handleAddSection = async (courseId) => {
      const formData = new FormData();
      formData.append('S_title', newSection.S_title);
      formData.append('S_description', newSection.S_description);
      if (newSection.S_content) formData.append('S_content', newSection.S_content);
      try {
         const res = await axiosInstance.post(`/api/user/addsection/${courseId}`, formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });
         if (res.data.success) {
            setPopupMessage('Section added successfully.');
            setPopupType('success');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2200);
            setShowSectionForm(null);
            setNewSection({ S_title: '', S_description: '', S_content: null });
            getAllCoursesUser();
         } else {
            setPopupMessage('Failed to add section.');
            setPopupType('error');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2200);
         }
      } catch (error) {
         setPopupMessage('An error occurred while adding the section.');
         setPopupType('error');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 2200);
      }
   };

   const handleLogout = () => {
      // Add your logout logic here
      localStorage.removeItem('token');
      // Redirect to login or home page
      window.location.href = '/login';
   };

   // Add this function to trigger the logout modal from anywhere (e.g., NavBar)
   useEffect(() => {
      window.showLogoutModalFromNav = () => setShowLogoutModal(true);
      return () => { delete window.showLogoutModalFromNav; };
   }, []);

   return (
      <>
      {/* Professional popup for feedback */}
      {showPopup && (
         <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <div style={{
               background: '#fff',
               color: '#222',
               fontWeight: 700,
               fontSize: '1.1rem',
               borderRadius: '16px',
               padding: '28px 36px',
               boxShadow: '0 4px 24px #ffe08299',
               minWidth: 320,
               textAlign: 'center',
               position: 'relative',
               display: 'flex',
               alignItems: 'center',
               gap: 12,
            }}>
               <span style={{fontSize: 28, marginRight: 10}}>
                  {popupType === 'success' && <i className="bi bi-check-circle-fill" style={{color:'#388e3c'}}></i>}
                  {popupType === 'error' && <i className="bi bi-x-octagon-fill" style={{color:'#d32f2f'}}></i>}
                  {popupType === 'info' && <i className="bi bi-info-circle-fill" style={{color:'#1976d2'}}></i>}
               </span>
               <span>{popupMessage}</span>
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
      {/* Delete confirmation modal */}
      {showDeleteModal && (
         <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <div style={{
               background: '#fff',
               border: '2px solid #ff5252',
               color: '#222',
               fontWeight: 700,
               fontSize: '1.1rem',
               borderRadius: '16px',
               padding: '32px 40px',
               boxShadow: '0 4px 24px #ffe08299',
               minWidth: 340,
               textAlign: 'center',
               position: 'relative',
               maxWidth: 400,
            }}>
               <span style={{fontSize: 28, marginRight: 10}}><i className="bi bi-trash" style={{color:'#ff5252'}}></i></span>
               <div style={{marginBottom: 18, marginTop: 8}}>
                  Are you sure you want to delete this course? This action cannot be undone.
               </div>
               <div style={{marginTop: 12, display: 'flex', justifyContent: 'center', gap: 18}}>
                  <Button variant="danger" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={confirmDeleteCourse}>OK</Button>
                  <Button variant="secondary" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={()=>setShowDeleteModal(false)}>Cancel</Button>
               </div>
               <button onClick={() => setShowDeleteModal(false)} style={{
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
      {/* Logout confirmation modal */}
      {showLogoutModal && (
         <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <div style={{
               background: '#fff',
               border: '2px solid #ff5252',
               color: '#222',
               fontWeight: 700,
               fontSize: '1.1rem',
               borderRadius: '16px',
               padding: '32px 40px',
               boxShadow: '0 4px 24px #ffe08299',
               minWidth: 340,
               textAlign: 'center',
               position: 'relative',
               maxWidth: 400,
            }}>
               <span style={{fontSize: 28, marginRight: 10}}><i className="bi bi-box-arrow-right" style={{color:'#ff5252'}}></i></span>
               <div style={{marginBottom: 18, marginTop: 8}}>
                  Are you sure you want to log out?
               </div>
               <div style={{marginTop: 12, display: 'flex', justifyContent: 'center', gap: 18}}>
                  <Button variant="danger" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={handleLogout}>OK</Button>
                  <Button variant="secondary" style={{fontWeight:600, minWidth:90, borderRadius:8}} onClick={()=>setShowLogoutModal(false)}>Cancel</Button>
               </div>
               <button onClick={() => setShowLogoutModal(false)} style={{
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
      <style>{`
         .top-action-bar {
            display: flex;
            justify-content: flex-end;
            gap: 18px;
            margin-bottom: 24px;
         }
         .action-btn {
            background: linear-gradient(90deg, #29b6f6 0%, #ffe082 100%);
            color: #222;
            font-weight: 700;
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 8px #29b6f633;
            padding: 10px 28px;
            font-size: 1.1rem;
            letter-spacing: 1px;
            transition: background 0.2s, box-shadow 0.2s, color 0.2s;
         }
         .action-btn:hover {
            background: linear-gradient(90deg, #ffe082 0%, #29b6f6 100%);
            color: #222;
            box-shadow: 0 4px 16px #29b6f655;
         }
         .card-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
            justify-items: center;
            margin-top: 40px;
         }
         @media (max-width: 1200px) {
            .card-container {
               grid-template-columns: repeat(2, 1fr);
            }
         }
         @media (max-width: 800px) {
            .card-container {
               grid-template-columns: 1fr;
            }
         }
         .card {
            min-width: 320px;
            max-width: 370px;
            width: 100%;
            height: 390px; /* Fixed height for all cards */
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(41,182,246,0.10), 0 2px 8px rgba(255,179,0,0.10);
            transition: transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s;
            border: none;
            background: linear-gradient(120deg, #fffde7 60%, #ffe082 100%);
            margin-bottom: 18px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         }
         .card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 8px 32px rgba(255,179,0,0.18), 0 2px 8px rgba(41,182,246,0.10);
            z-index: 2;
         }
         .card-title {
            font-weight: bold;
            color: #ffb300;
            font-size: 1.5rem;
            letter-spacing: 1px;
         }
         .card-text p {
            margin-bottom: 0.5rem;
            font-size: 1.08rem;
         }
         .read-more-link {
            color: #29b6f6;
            cursor: pointer;
            font-weight: 600;
            margin-left: 6px;
            text-decoration: underline;
            transition: color 0.2s;
         }
         .read-more-link:hover {
            color: #ffb300;
         }
         .delete-course-btn {
            background: linear-gradient(90deg, #ff5252 0%, #ffb300 100%);
            border: none;
            font-weight: 600;
            color: #fff;
            box-shadow: 0 2px 8px #ffb30033;
            border-radius: 8px;
            transition: background 0.2s, box-shadow 0.2s;
         }
         .delete-course-btn:hover {
            background: linear-gradient(90deg, #ffb300 0%, #ff5252 100%);
            color: #fff;
            box-shadow: 0 4px 16px #ffb30055;
         }
         .add-section-btn {
            background: linear-gradient(90deg, #29b6f6 0%, #66bb6a 100%);
            color: #fff;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 8px #66bb6a33;
            transition: background 0.2s, box-shadow 0.2s;
         }
         .add-section-btn:hover {
            background: linear-gradient(90deg, #66bb6a 0%, #29b6f6 100%);
            color: #fff;
            box-shadow: 0 4px 16px #66bb6a55;
         }
      `}</style>
      <Container className='card-container'>
         {allCourses?.length > 0 ? (
            allCourses
              .filter(course => course && course._id && course.C_title && course.sections)
              .map((course) => (
               <Card key={course._id} className='card' style={{height: 390, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}> {/* Fixed height for uniform size */}
                  <Card.Body style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                     <Card.Title className="card-title">{course.C_title}</Card.Title>
                     <div style={{flex: 1}}>
                        <div>
                           <strong>Description: </strong>
                           {course.showFullDescription
                              ? course.C_description
                              : (course.C_description ? course.C_description.slice(0, 40) : '')}{' '}
                           {course.C_description && course.C_description.length > 40 && (
                              <span
                                 className='read-more-link'
                                 onClick={() => toggleDescription(course._id)}
                              >
                                 {course.showFullDescription ? 'Read Less' : 'Read More'}
                              </span>
                           )}
                        </div>
                        <div>
                           <strong>Category: </strong>
                           {course.C_categories}
                        </div>
                        <div>
                           <strong>Sections: </strong> {course.sections.length}
                        </div>
                        <div style={{color: '#c3b9b9'}}>
                           <strong>Enrolled students: </strong> {course.enrolled}
                        </div>
                     </div>
                     <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8}}>
                        <Button
                           variant='info'
                           className='add-section-btn'
                           size='sm'
                           style={{flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '6px 2px', fontSize: '0.98rem'}}
                           onClick={() => navigate(`/teacher/add-section?courseId=${course._id}`)}
                        >
                           Add Section
                        </Button>
                        <Button
                           variant='warning'
                           className='add-section-btn'
                           size='sm'
                           style={{flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '6px 2px', fontSize: '0.98rem'}}
                           onClick={() => navigate(`/teacher/edit-course/${course._id}`)}
                        >
                           Edit Course
                        </Button>
                        {course.enrolled === 0 && (
                           <Button variant='danger' className='delete-course-btn' size='sm' style={{flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '6px 2px', fontSize: '0.98rem'}} onClick={() => deleteCourse(course._id)}>Delete</Button>
                        )}
                     </div>
                     {showSectionForm === course._id && (
                        <form className='mt-3' onSubmit={e => { e.preventDefault(); handleAddSection(course._id); }}>
                           <input
                              type='text'
                              name='S_title'
                              value={newSection.S_title}
                              onChange={handleSectionChange}
                              placeholder='Section Title'
                              required
                              style={{marginBottom:8, borderRadius:6, border:'1px solid #ccc', padding:'6px 10px', width:'100%'}}
                           />
                           <input
                              type='file'
                              name='S_content'
                              accept='video/*,image/*'
                              onChange={handleSectionChange}
                              style={{marginBottom:8, width:'100%'}}
                           />
                           <textarea
                              name='S_description'
                              value={newSection.S_description}
                              onChange={handleSectionChange}
                              placeholder='Section Description'
                              required
                              style={{marginBottom:8, borderRadius:6, border:'1px solid #ccc', padding:'6px 10px', width:'100%'}}
                           />
                           <Button type='submit' variant='success' size='sm' style={{marginRight:8}}>Save Section</Button>
                           <Button variant='secondary' size='sm' onClick={() => setShowSectionForm(null)}>Cancel</Button>
                        </form>
                     )}
                  </Card.Body>
               </Card>
            ))
         ) : (
            <div style={{color:'#888', fontWeight:'bold', fontSize:'1.2rem', padding:'30px 0'}}>No courses found!!</div>
         )}
      </Container>
      </>
   );
};

export default TeacherHome;
