import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../common/AxiosInstance';

const AddSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get courseId from query params
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get('courseId');
  const [section, setSection] = useState({
    S_title: '',
    S_description: '',
    S_content: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSection({ ...section, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!courseId) {
      // Draft mode: Save section to localStorage and return to AddCourse
      try {
        const storedSections = localStorage.getItem('addCourseSections');
        let sections = [];
        if (storedSections) {
          sections = JSON.parse(storedSections);
        }
        sections.push(section);
        localStorage.setItem('addCourseSections', JSON.stringify(sections));
        setSuccess('Section added to draft!');
        setTimeout(() => navigate('/teacher/add-course'), 800); // Go back to AddCourse page
      } catch (err) {
        setError('Failed to save section to draft.');
      }
      return;
    }
    const formData = new FormData();
    formData.append('S_title', section.S_title);
    formData.append('S_description', section.S_description);
    if (section.S_content) formData.append('S_content', section.S_content);
    try {
      const res = await axiosInstance.post(`/api/user/addsection/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setSuccess('Section added successfully!');
        setTimeout(() => navigate('/teacher/add-course'), 1200); // Go back to AddCourse page
      } else {
        setError('Failed to add section.');
      }
    } catch (err) {
      setError('An error occurred while adding the section.');
    }
  };

  return (
    <div className='add-section-container' style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #29b6f655', padding: 32 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 24 }}>Add Section</h3>
      {error && <div style={{color:'#d32f2f', marginBottom:12, fontWeight:600}}>{error}</div>}
      {success && <div style={{color:'#388e3c', marginBottom:12, fontWeight:600}}>{success}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='sectionTitle'>
          <Form.Label>Section Title</Form.Label>
          <Form.Control name='S_title' value={section.S_title} onChange={handleChange} type='text' placeholder='Enter Section Title' required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='sectionContent'>
          <Form.Label>Section Content (Video or Image)</Form.Label>
          <Form.Control name='S_content' onChange={handleChange} type='file' accept='video/*,image/*' required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='sectionDescription'>
          <Form.Label>Section Description</Form.Label>
          <Form.Control name='S_description' value={section.S_description} onChange={handleChange} as='textarea' placeholder='Enter Section description' required />
        </Form.Group>
        <Button variant='success' type='submit' style={{ minWidth: 120, fontWeight: 600 }}>Add Section</Button>
      </Form>
    </div>
  );
};

export default AddSection;
