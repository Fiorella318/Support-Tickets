import { type Ticket } from '../types/ticket';
import { useState } from 'react';

interface Props {
  ticket: Ticket;
  onStatusChange: (id: string) => void;
  onDeleteTicket: (id: string) => void;
  isDark?: boolean;
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket, isDark }: Props) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  const priorityColor = ticket.priority === 'High' ? '#FF4D4D' : ticket.priority === 'Medium' ? '#FFA500' : '#4DA6FF';

  // Lógica de estilos dinámicos respetando tu estructura original
  const cardStyle = {
    background: isDark ? '#1A202C' : 'white',
    padding: '16px 20px',
    borderRadius: '14px',
    marginBottom: '15px',
    boxShadow: isDark 
      ? (isHovered ? '0 8px 25px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.2)') 
      : (isHovered ? '0 8px 25px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)'),
    borderLeft: `6px solid ${priorityColor}`,
    border: isDark ? `1px solid #4A5568` : 'none',
    position: 'relative' as 'relative',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
    color: isDark ? '#F7FAFC' : '#1A202C'
  };

  const trashButtonStyle = {
    position: 'absolute' as 'absolute',
    top: '14px',
    right: '14px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: isTrashHovered ? '#FF4D4D' : (isDark ? '#4A5568' : '#CBD5E0'),
    transition: 'all 0.2s ease',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
  };

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket.id)}
      style={cardStyle}
      onClick={() => setIsMinimized(!isMinimized)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BOTÓN DE BASURITA REINSTALADO CON TODOS SUS ESTILOS */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTicket(ticket.id);
        }}
        onMouseEnter={() => setIsTrashHovered(true)}
        onMouseLeave={() => setIsTrashHovered(false)}
        style={trashButtonStyle}
        title="Delete ticket"
      >
        🗑️
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: isDark ? '#2D3748' : '#EDF2F7', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 800,
          fontSize: '0.9rem',
          color: priorityColor,
          border: isDark ? `1px solid ${priorityColor}44` : 'none'
        }}>
          {ticket.assignedTo[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            color: isDark ? '#A0AEC0' : '#718096', 
            fontWeight: 800, 
            letterSpacing: '0.5px' 
          }}>
            {ticket.assignedTo.toUpperCase()}
          </span>
          <h4 style={{ 
            margin: '2px 0 0 0', 
            fontSize: '1rem', 
            fontWeight: 700, 
            lineHeight: 1.3 
          }}>
            {ticket.subject}
          </h4>
        </div>
      </div>
      
      {/* CUERPO EXPANDIBLE DETALLADO */}
      {!isMinimized && (
        <div style={{ 
          marginTop: '18px', 
          paddingTop: '15px', 
          borderTop: `1px solid ${isDark ? '#4A5568' : '#f0f0f0'}`,
          animation: 'fadeIn 0.3s ease'
        }}>
          <p style={{ 
            fontSize: '0.88rem', 
            color: isDark ? '#CBD5E0' : '#4a5568', 
            margin: '0 0 20px 0',
            lineHeight: 1.5 
          }}>
            {ticket.description}
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               <span style={{ 
                 fontSize: '0.65rem', 
                 padding: '3px 8px', 
                 borderRadius: '6px', 
                 background: `${priorityColor}22`, 
                 color: priorityColor, 
                 fontWeight: 800 
               }}>
                {ticket.priority.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.65rem', color: isDark ? '#4A5568' : '#CBD5E0' }}>
                {ticket.createdAt}
              </span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(ticket.id);
              }}
              style={{
                border: 'none', 
                background: 'none', 
                cursor: 'pointer',
                fontSize: '0.75rem', 
                color: isDark ? '#94A3B8' : '#A0AEC0', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              MOVE STATUS ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}