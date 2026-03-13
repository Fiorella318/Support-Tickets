import React, { useState } from 'react';
import { type Ticket, type Priority } from '../types/ticket'; // RUTA CORREGIDA con ../

interface Props { 
  onAddTicket: (ticket: Ticket) => void; 
  isDark?: boolean; 
}

export default function TicketForm({ onAddTicket, isDark }: Props) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !assignedTo) return alert('Attention: Please fill all required fields before submitting.');
    
    onAddTicket({ 
      id: crypto.randomUUID(), 
      subject, 
      description, 
      priority, 
      status: 'Open', 
      assignedTo, 
      createdAt: new Date().toLocaleString() 
    });

    // Reset de campos
    setSubject(''); 
    setDescription(''); 
    setAssignedTo('');
    setPriority('Medium');
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '0.72rem', 
    fontWeight: 800, 
    color: isDark ? '#A0AEC0' : '#718096', 
    marginBottom: '8px', 
    marginLeft: '5px',
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    width: '100%', 
    padding: '14px 18px', 
    borderRadius: '14px', 
    marginBottom: '18px',
    border: isDark ? '1px solid #4A5568' : '1px solid #E2E8F0',
    background: isDark ? '#1A202C' : '#FFFFFF',
    color: isDark ? '#F7FAFC' : '#1A202C',
    fontSize: '0.92rem', 
    outline: 'none', 
    boxSizing: 'border-box' as 'border-box',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ 
      background: isDark ? '#2D3748' : 'white', 
      padding: '32px', 
      borderRadius: '28px', 
      border: isDark ? '1px solid #4A5568' : 'none',
      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ 
        margin: '0 0 25px 0', 
        color: isDark ? '#F7FAFC' : '#1A202C', 
        fontWeight: 800,
        fontSize: '1.3rem'
      }}>
        Register New Ticket
      </h3>
      
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>ASSIGNED AGENT</label>
        <input 
          style={inputStyle} 
          value={assignedTo} 
          onChange={(e) => setAssignedTo(e.target.value)} 
          placeholder="Enter agent name..." 
        />
        
        <label style={labelStyle}>TICKET SUBJECT</label>
        <input 
          style={inputStyle} 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="What is the issue about?" 
        />
        
        <label style={labelStyle}>PRIORITY LEVEL</label>
        <select 
          style={inputStyle} 
          value={priority} 
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="Low">Low - Minor Issue</option>
          <option value="Medium">Medium - Standard</option>
          <option value="High">High - Urgent Case</option>
        </select>
        
        <label style={labelStyle}>DETAILED DESCRIPTION</label>
        <textarea 
          style={{ ...inputStyle, minHeight: '120px', resize: 'none' }} 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Provide more context about the support request..." 
        />
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            background: '#3B82F6', 
            color: 'white', 
            border: 'none', 
            padding: '16px', 
            borderRadius: '14px', 
            fontWeight: 800, 
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#2563EB'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#3B82F6'}
        >
          Create Support Ticket
        </button>
      </form>
    </div>
  );
}