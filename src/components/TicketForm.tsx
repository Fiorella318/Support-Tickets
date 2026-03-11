import { useState } from 'react';
import { type Ticket, type Priority } from '../types/ticket';

interface Props {
  onAddTicket: (ticket: Ticket) => void;
}

export default function TicketForm({ onAddTicket }: Props) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !assignedTo) return alert('Please fill all fields');
    onAddTicket({
      id: crypto.randomUUID(), subject, description, priority,
      status: 'Open', assignedTo, createdAt: new Date().toLocaleString()
    });
    setSubject(''); setDescription(''); setAssignedTo('');
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#FFFFFF',
    marginBottom: '12px',
    boxSizing: 'border-box' as 'border-box',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '28px', 
      borderRadius: '24px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
      marginBottom: '25px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1A202C', fontSize: '1.1rem', fontWeight: 700 }}>
        Create Pro Ticket
      </h3>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#718096', marginBottom: '6px', marginLeft: '4px' }}>AGENT NAME</label>
        <input style={inputStyle} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="e.g. Maria G." />
        
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#718096', marginBottom: '6px', marginLeft: '4px' }}>TICKET SUBJECT</label>
        <input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief title" />
        
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#718096', marginBottom: '6px', marginLeft: '4px' }}>PRIORITY LEVEL</label>
        <select style={inputStyle} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#718096', marginBottom: '6px', marginLeft: '4px' }}>DESCRIPTION</label>
        <textarea 
          style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe the issue..." 
        />
        
        <button type="submit" style={{ 
          width: '100%',
          background: '#4299E1', 
          color: 'white', 
          border: 'none', 
          padding: '14px', 
          borderRadius: '12px', 
          fontWeight: 700, 
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
          transition: 'transform 0.2s'
        }}>
          Add to Queue
        </button>
      </form>
    </div>
  );
}