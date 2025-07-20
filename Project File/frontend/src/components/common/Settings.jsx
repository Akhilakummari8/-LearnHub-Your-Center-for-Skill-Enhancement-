import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { Card, Button, Form } from 'react-bootstrap';
import axiosInstance from "./AxiosInstance";

const Settings = () => {
  const { userData, updateUserData } = useContext(UserContext);
  const [email, setEmail] = useState(userData?.email || '');
  const [name, setName] = useState(userData?.name || '');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update in DB
      const token = localStorage.getItem('token');
      const res = await axiosInstance.put(
        '/api/user/update-profile',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const updated = { ...userData, name };
        updateUserData(updated);
        setMessage('Profile updated!');
      } else {
        setMessage(res.data.message || 'Update failed');
      }
    } catch (err) {
      setMessage('Update failed');
    }
  };

  if (!userData) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <Card style={{ minWidth: 340, maxWidth: 400, borderRadius: 24, boxShadow: '0 8px 32px rgba(102,126,234,0.18)', border: 'none', background: 'rgba(255,255,255,0.95)' }}>
        <Card.Body style={{ padding: 40 }}>
          <h3 style={{ fontWeight: 800, color: '#667eea', marginBottom: 18, letterSpacing: 1, textAlign: 'center' }}>Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 16px #667eea33' }}>
              <i className="bi bi-person-circle" style={{ color: 'white', fontSize: 48 }}></i>
            </div>
            <h4 style={{ fontWeight: 700, color: '#667eea', marginBottom: 2 }}>{name}</h4>
            <div style={{ color: '#333', fontWeight: 500, fontSize: 17, background: '#f3f3fa', borderRadius: 8, padding: '4px 14px' }}>{email}</div>
            <div style={{ color: '#764ba2', fontWeight: 700, fontSize: 15, background: '#ede7f6', borderRadius: 8, padding: '2px 12px' }}>{userData?.type}</div>
          </div>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} disabled />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ borderRadius: 10, fontWeight: 700, width: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', border: 'none', boxShadow: '0 2px 8px #667eea33' }}>
              Save Changes
            </Button>
          </Form>
          {message && <div style={{ color: '#28a745', marginTop: 16, fontWeight: 600, textAlign: 'center', background: '#e8f5e9', borderRadius: 8, padding: '8px 0' }}>{message}</div>}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
