import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { Card } from 'react-bootstrap';

const Profile = () => {
  const { userData } = useContext(UserContext);
  if (!userData) return null;
  const { name, email, type } = userData;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <Card style={{ minWidth: 340, maxWidth: 400, borderRadius: 24, boxShadow: '0 8px 32px rgba(102,126,234,0.18)', border: 'none', background: 'rgba(255,255,255,0.95)' }}>
        <Card.Body style={{ padding: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 16px #667eea33' }}>
              <i className="bi bi-person-circle" style={{ color: 'white', fontSize: 48 }}></i>
            </div>
            <h3 style={{ fontWeight: 800, color: '#667eea', marginBottom: 2, letterSpacing: 1 }}>{name}</h3>
            <div style={{ color: '#333', fontWeight: 500, fontSize: 17, background: '#f3f3fa', borderRadius: 8, padding: '4px 14px' }}>{email}</div>
            <div style={{ color: '#764ba2', fontWeight: 700, fontSize: 15, marginBottom: 10, background: '#ede7f6', borderRadius: 8, padding: '2px 12px' }}>{type}</div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
