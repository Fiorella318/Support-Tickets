import { useState } from 'react';
import { type Ticket } from '../types/ticket'; // <-- Ruta corregida

interface Props {
  ticket: Ticket;
  onStatusChange: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket }: Props) {
  const [isMinimized, setIsMinimized] = useState(true);

  const priorityColor = 
    ticket.priority === 'High' ? '#FF4D4D' : 
    ticket.priority === 'Medium' ? '#FFA500' : 
    '#4DA6FF';

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket.id)}
      style={{
        background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `6px solid ${priorityColor}`,
        position: 'relative', cursor: 'pointer', transition: 'transform 0.2s ease'
      }}
      onClick={() => setIsMinimized(!isMinimized)}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onDeleteTicket(ticket.id); }}
        style={{
          position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'none',
          cursor: 'pointer', fontSize: '1rem', color: '#CBD5E0'
        }}
      >
        🗑
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EDF2F7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', 
          fontWeight: 'bold', color: '#4A5568'
        }}>
          {ticket.assignedTo ? ticket.assignedTo[0].toUpperCase() : '?'}
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#A0AEC0', fontWeight: 700 }}>{ticket.assignedTo}</span>
          <h4 style={{ margin: '0', fontSize: '0.95rem', color: '#2D3748', fontWeight: 700 }}>{ticket.subject}</h4>
        </div>
      </div>
      
      {!isMinimized && (
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F7FAFC' }}>
          <p style={{ fontSize: '0.85rem', color: '#4A5568', lineHeight: '1.5', margin: '0 0 15px 0' }}>{ticket.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: priorityColor, fontWeight: 800 }}>{ticket.priority.toUpperCase()}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusChange(ticket.id); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#4A5568', fontWeight: 600 }}
            >
              move task →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}