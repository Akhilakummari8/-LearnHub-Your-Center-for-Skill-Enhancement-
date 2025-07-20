import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

function SectionVideoPreview({ file, onChange, readOnly }) {
  const [error, setError] = React.useState(false);
  let videoUrl = '';
  if (file instanceof File) {
    videoUrl = URL.createObjectURL(file);
  } else if (file && typeof file === 'string') {
    // If already a full URL, use as is; otherwise, prepend backend uploads path
    videoUrl = file.startsWith('http')
      ? file
      : `http://localhost:5000/uploads/${file}`;
  }
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

const EditCourse = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    // Fetch course details by courseId
    axiosInstance.get(`/api/user/course/${courseId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setCourse(res.data.course))
      .catch(() => setPopupMessage('Failed to load course'));
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSectionChange = (idx, key, value) => {
    const updated = [...course.sections];
    updated[idx][key] = value;
    setCourse({ ...course, sections: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(course).forEach((key) => {
      if (key === 'sections') {
        course[key].forEach((section, index) => {
          if (section.S_content instanceof File) {
            formData.append(`S_content`, section.S_content);
          }
          formData.append(`S_title`, section.S_title);
          formData.append(`S_description`, section.S_description);
        });
      } else {
        formData.append(key, course[key]);
      }
    });
    try {
      const res = await axiosInstance.put(`/api/user/course/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('EditCourse PUT response:', res);
      if (res.status === 200 && res.data.success) {
        setPopupMessage('Course updated successfully');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/dashboard?tab=teacher'); // or use the correct teacher dashboard route if different
        }, 1200);
      } else {
        setPopupMessage('Failed to update course');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2500);
      }
    } catch (error) {
      console.error('EditCourse PUT error:', error);
      setPopupMessage('An error occurred while updating the course');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className='edit-course-container' style={{background:'#f7f9fa', minHeight:'100vh', padding:'32px 0'}}>
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', color: '#222', fontWeight: 700, fontSize: '1.1rem',
            borderRadius: '16px', padding: '28px 36px', boxShadow: '0 4px 24px #ffe08299',
            minWidth: 280, textAlign: 'center', position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {popupMessage}
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#ff5252', cursor: 'pointer' }} aria-label="Close popup">×</button>
          </div>
        </div>
      )}
      <div style={{maxWidth: 900, margin: '0 auto'}}>
        <h2 style={{color:'#ffb300', fontWeight:700, marginBottom:24, textAlign:'center'}}>Edit Course</h2>
        {/* Course summary card */}
        <div style={{marginBottom: 32}}>
          <div style={{background:'#fffde7', borderRadius:14, boxShadow:'0 2px 8px #ffe08255', padding:'24px 32px'}}>
            <h3 style={{color:'#ffb300', fontWeight:700, fontSize:'1.3rem', marginBottom:8}}>{course.C_title}</h3>
            <div style={{marginBottom:6}}><strong>Description:</strong> {course.C_description}</div>
            <div style={{marginBottom:6}}><strong>Category:</strong> {course.C_categories}</div>
            <div style={{marginBottom:6}}><strong>Sections:</strong> {course.sections ? course.sections.length : 0}</div>
            <div style={{color:'#888'}}><strong>Enrolled students:</strong> {course.enrolled !== undefined ? course.enrolled : 0}</div>
          </div>
        </div>
        <Form className="mb-3" onSubmit={handleSubmit} style={{background:'#fff', borderRadius:14, boxShadow:'0 2px 8px #29b6f633', padding:'32px 28px'}}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridJobType">
              <Form.Label>Course Type</Form.Label>
              <Form.Select name="C_categories" value={course.C_categories} onChange={handleChange}>
                <option>Select categories</option>
                <option>IT & Software</option>
                <option>Finance & Accounting</option>
                <option>Personal Development</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridTitle">
              <Form.Label>Course Title</Form.Label>
              <Form.Control 
                name='C_title' 
                value={course.C_title} 
                onChange={e => {
                  // Allow only letters and spaces
                  const val = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(val)) {
                    handleChange(e);
                  }
                }}
                type="text" 
                placeholder="Enter Course Title" 
                required 
                inputMode="text"
                pattern="^[a-zA-Z\s]*$"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridTitle">
              <Form.Label>Course Educator</Form.Label>
              <Form.Control 
                name='C_educator' 
                value={course.C_educator} 
                onChange={e => {
                  // Allow only letters and spaces
                  const val = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(val)) {
                    handleChange(e);
                  }
                }}
                type="text" 
                placeholder="Enter Course Educator" 
                required 
                inputMode="text"
                pattern="^[a-zA-Z\s]*$"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridTitle">
              <Form.Label>Course Price</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control 
                  name='C_price' 
                  value={course.C_price} 
                  onChange={e => {
                    // Allow only numbers
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      handleChange(e);
                    }
                  }}
                  type="number" 
                  min="0"
                  placeholder="for free course, enter 0" 
                  required 
                  inputMode="numeric"
                  style={{ paddingLeft: 38 }}
                />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#888' }}>Rs.</span>
              </div>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="formGridAddress2">
              <Form.Label>Course Description</Form.Label>
              <Form.Control name='C_description' value={course.C_description} onChange={handleChange} required as={"textarea"} placeholder="Enter Course description" />
            </Form.Group>
          </Row>
          <hr />
          {course.sections && course.sections.length > 0 && (
            <div className="mb-4">
              <h5 style={{marginBottom:16, color:'#1976d2'}}>Sections</h5>
              {course.sections.map((section, idx) => (
                <div key={idx} className="border rounded-3 p-3 mb-3" style={{background:'#f5faff', boxShadow:'0 1px 4px #29b6f622', position:'relative'}}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong style={{fontSize:'1.08em'}}>{section.S_title}</strong>
                      <div style={{fontSize: '0.97em', color: '#555'}}>{section.S_description}</div>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      style={{position:'absolute', top:10, right:10, borderRadius: '50%', width: 32, height: 32, padding: 0, fontWeight:700, fontSize:18}}
                      title="Remove Section"
                      onClick={() => {
                        const updatedSections = course.sections.filter((_, i) => i !== idx);
                        setCourse({ ...course, sections: updatedSections });
                      }}
                      aria-label="Remove section"
                    >
                      ×
                    </Button>
                  </div>
                  <SectionVideoPreview
                    file={section.S_content}
                    onChange={file => handleSectionChange(idx, 'S_content', file)}
                  />
                  <Form.Group className="mt-2">
                    <Form.Label>Section Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={section.S_title} 
                      onChange={e => {
                        // Allow only letters and spaces
                        const val = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(val)) {
                          handleSectionChange(idx, 'S_title', val);
                        }
                      }}
                      pattern="^[a-zA-Z\s]*$"
                      inputMode="text"
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>Section Description</Form.Label>
                    <Form.Control as="textarea" value={section.S_description} onChange={e => handleSectionChange(idx, 'S_description', e.target.value)} />
                  </Form.Group>
                </div>
              ))}
            </div>
          )}
          <Button variant="success" className='submit-course-btn' type="submit" style={{fontWeight:600, fontSize:'1.1rem', borderRadius:8, padding:'10px 32px', marginTop:8}}>
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditCourse;
