import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
   const user = useContext(UserContext);
   const navigate = useNavigate();
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });
   const [showPopup, setShowPopup] = useState(false);
   const [popupMessage, setPopupMessage] = useState("");
   const [showPreview, setShowPreview] = useState(false);

   // Load course draft fields and sections from localStorage on mount
   useEffect(() => {
      const storedDraft = localStorage.getItem('addCourseDraft');
      if (storedDraft) {
         try {
            const parsedDraft = JSON.parse(storedDraft);
            setAddCourse((prev) => ({ ...prev, ...parsedDraft }));
         } catch (e) {}
      }
      const storedSections = localStorage.getItem('addCourseSections');
      if (storedSections) {
         try {
            const parsedSections = JSON.parse(storedSections);
            if (Array.isArray(parsedSections) && parsedSections.length > 0) {
               setAddCourse((prev) => ({
                  ...prev,
                  sections: [...parsedSections],
               }));
            }
         } catch (e) {}
      }
   }, []);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData();
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section, index) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      for (const [key, value] of formData.entries()) {
         console.log(`${key}:`, value);
      }

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         // On successful course creation, clear draft fields as well
         if (res.status === 201) {
            if (res.data.success) {
               setPopupMessage(res.data.message || 'Course created successfully');
               setShowPopup(true);
               localStorage.removeItem('addCourseSections');
               localStorage.removeItem('addCourseDraft');
               setTimeout(() => {
                  setShowPopup(false);
                  navigate('/dashboard');
               }, 1200);
            } else {
               setPopupMessage('Failed to create course');
               setShowPopup(true);
               setTimeout(() => setShowPopup(false), 2500);
            }
         } else {
            setPopupMessage('Unexpected response status: ' + res.status);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2500);
         }
      } catch (error) {
         setPopupMessage('An error occurred while creating the course, only .mp4 videos can be uploaded');
         setShowPopup(true);
         setTimeout(() => setShowPopup(false), 2500);
      }
   };

   // Save course draft fields to localStorage before navigating to Add Section
   const handleAddSection = () => {
      const draft = {
         userId: addCourse.userId,
         C_educator: addCourse.C_educator,
         C_title: addCourse.C_title,
         C_categories: addCourse.C_categories,
         C_price: addCourse.C_price,
         C_description: addCourse.C_description,
      };
      localStorage.setItem('addCourseDraft', JSON.stringify(draft));
      navigate('/teacher/add-section');
   };

   return (
      <div className='add-course-container'>
         {/* Preview Modal */}
         {showPreview && (
            <div style={{
               position: 'fixed',
               top: 0, left: 0, right: 0, bottom: 0,
               background: 'rgba(0,0,0,0.25)',
               zIndex: 10000,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
               <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 32,
                  minWidth: 350,
                  maxWidth: 600,
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 4px 24px #29b6f655',
                  position: 'relative',
               }}>
                  <button onClick={() => setShowPreview(false)} style={{
                     position: 'absolute',
                     top: 12,
                     right: 18,
                     background: 'none',
                     border: 'none',
                     fontSize: 26,
                     color: '#ff5252',
                     cursor: 'pointer',
                  }} aria-label="Close preview">×</button>
                  <h3 style={{marginBottom: 12}}>Course Preview</h3>
                  <div><b>Title:</b> {addCourse.C_title}</div>
                  <div><b>Educator:</b> {addCourse.C_educator}</div>
                  <div><b>Category:</b> {addCourse.C_categories}</div>
                  <div><b>Price:</b> {addCourse.C_price}</div>
                  <div><b>Description:</b> {addCourse.C_description}</div>
                  <hr />
                  <h5>Sections</h5>
                  {addCourse.sections && addCourse.sections.length > 0 ? (
                     addCourse.sections.map((section, idx) => (
                        <div key={idx} style={{marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10}}>
                           <div><b>{section.S_title}</b></div>
                           <div style={{fontSize: '0.95em', color: '#555'}}>{section.S_description}</div>
                           {section.S_content && (
                              <SectionVideoPreview file={section.S_content} readOnly />
                           )}
                        </div>
                     ))
                  ) : <div>No sections added.</div>}
               </div>
            </div>
         )}
         {/* Popup for feedback */}
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
                  minWidth: 280,
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
               }}>
                  {popupMessage.toLowerCase().includes('only .mp4 videos can be uploaded') || popupMessage.toLowerCase().includes('file too large') ? (
                     <span style={{fontSize: 22, marginRight: 8, color: '#ff5252'}}><i className="bi bi-x-octagon-fill"></i></span>
                  ) : (
                     <span style={{fontSize: 22, marginRight: 8, color: '#66bb6a'}}><i className="bi bi-check-circle-fill"></i></span>
                  )}
                  {popupMessage}
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
         <style>{`
            .add-course-container {
               background: linear-gradient(120deg, #e3f2fd 60%, #fffde7 100%);
               border-radius: 18px;
               box-shadow: 0 4px 24px rgba(41,182,246,0.10), 0 2px 8px rgba(255,179,0,0.10);
               padding: 32px 18px 24px 18px;
               margin: 32px auto;
               max-width: 700px;
            }
            .add-input-btn {
               background: linear-gradient(90deg, #29b6f6 0%, #ffe082 100%);
               color: #222;
               font-weight: 600;
               border: none;
               border-radius: 8px;
               box-shadow: 0 2px 8px #29b6f633;
               transition: background 0.2s, box-shadow 0.2s;
            }
            .add-input-btn:hover {
               background: linear-gradient(90deg, #ffe082 0%, #29b6f6 100%);
               color: #222;
               box-shadow: 0 4px 16px #29b6f655;
            }
            .submit-course-btn {
               background: linear-gradient(90deg, #66bb6a 0%, #ffe082 100%);
               color: #222;
               font-weight: 700;
               border: none;
               border-radius: 8px;
               box-shadow: 0 2px 8px #66bb6a33;
               transition: background 0.2s, box-shadow 0.2s;
               margin-top: 12px;
               min-width: 120px;
            }
            .submit-course-btn:hover {
               background: linear-gradient(90deg, #ffe082 0%, #66bb6a 100%);
               color: #222;
               box-shadow: 0 4px 16px #66bb6a55;
            }
         `}</style>
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridJobType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange}>
                     <option>Select categories</option>
                     <option>IT & Software</option>
                     <option>Finance & Accounting</option>
                     <option>Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control name='C_title' value={addCourse.C_title} onChange={handleChange} type="text" placeholder="Enter Course Title" required />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control name='C_educator' value={addCourse.C_educator} onChange={handleChange} type="text" placeholder="Enter Course Educator" required />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Price(Rs.)</Form.Label>
                  <Form.Control name='C_price' value={addCourse.C_price} onChange={handleChange} type="text" placeholder="for free course, enter 0" required />
               </Form.Group>
               <Form.Group as={Col} className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control name='C_description' value={addCourse.C_description} onChange={handleChange} required as={"textarea"} placeholder="Enter Course description" />
               </Form.Group>
            </Row>

            <hr />

            {/* Display added sections from localStorage */}
            {addCourse.sections && addCourse.sections.length > 0 && (
               <div className="mb-4">
                  <h5>Added Sections</h5>
                  {addCourse.sections.map((section, idx) => (
                     <div key={idx} className="border rounded-3 p-2 mb-2 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                           <div>
                              <strong>{section.S_title}</strong>
                              <div style={{fontSize: '0.95em', color: '#555'}}>{section.S_description}</div>
                           </div>
                           <Button size="sm" variant="danger" onClick={() => {
                              const updated = [...addCourse.sections];
                              updated.splice(idx, 1);
                              setAddCourse({ ...addCourse, sections: updated });
                              localStorage.setItem('addCourseSections', JSON.stringify(updated));
                           }}>Remove</Button>
                        </div>
                        {/* Video Preview for Section */}
                        {section.S_content && (
                           <SectionVideoPreview
                              file={section.S_content}
                              onChange={file => {
                                 const updated = [...addCourse.sections];
                                 updated[idx].S_content = file;
                                 setAddCourse({ ...addCourse, sections: updated });
                                 localStorage.setItem('addCourseSections', JSON.stringify(updated));
                              }}
                           />
                        )}
                     </div>
                  ))}
               </div>
            )}

            <Row className="mb-3">
               <Col xs={24} md={12} lg={8}>
                  <Button type="button" size='sm' variant='info' className='add-input-btn' onClick={handleAddSection}>
                     ➕Add Section
                  </Button>
               </Col>
            </Row>

            <Button variant="success" className='submit-course-btn' type="submit">
               Submit
            </Button>
         </Form>
      </div>
   );
};

function SectionVideoPreview({ file, onChange, readOnly }) {
   const [error, setError] = React.useState(false);
   // Only allow preview if file is a File object (in memory)
   if (!(file instanceof File)) {
      return (
         <div style={{ color: '#888', marginTop: 4 }}>
            Video will be uploaded on course submit.
         </div>
      );
   }
   const videoUrl = URL.createObjectURL(file);
   return (
      <div style={{ marginTop: 8, marginBottom: 8 }}>
         {!error ? (
            <video width="320" controls src={videoUrl} onError={() => setError(true)} style={{ borderRadius: 8, boxShadow: '0 2px 8px #29b6f633' }}>
               Your browser does not support the video tag.
            </video>
         ) : readOnly ? (
            <div style={{ color: 'red', marginTop: 4 }}>
               Video failed to play.
            </div>
         ) : (
            <div style={{ color: 'red', marginTop: 4 }}>
               Video failed to play. Please select a new video.<br />
               <input type="file" accept="video/mp4" onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                     setError(false);
                     onChange(e.target.files[0]);
                  }
               }} />
            </div>
         )}
      </div>
   );
}

export default AddCourse;
