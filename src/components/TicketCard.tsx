import { type Ticket } from '../types/ticket';
import { useState } from 'react';

interface Props {
  ticket: Ticket;
  onStatusChange: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket }: Props) {
  const [isMinimized, setIsMinimized] = useState(true);

  const priorityColor = ticket.priority === 'High' ? '#FF4D4D' : ticket.priority === 'Medium' ? '#FFA500' : '#4DA6FF';

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket.id)}
      style={{
        background: 'white', padding: '12px 15px', borderRadius: '10px', marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `5px solid ${priorityColor}`,
        position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease'
      }}
      onClick={() => setIsMinimized(!isMinimized)}
    >
      {/* Botón Eliminar (Esquina superior derecha) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTicket(ticket.id);
        }}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          border: 'none', background: 'none', cursor: 'pointer',
          fontSize: '1.1rem', color: '#ccc', transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
      >
        🗑
      </button>

      {/* CABECERA: Avatar, Agente y Subject */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '30px' }}>
        <div style={{ 
          width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eee',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
        }}>
          {ticket.assignedTo[0]?.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.7rem', color: '#999' }}>{ticket.assignedTo}</span>
          <h4 style={{ margin: '0', fontSize: '0.95rem', color: '#1a202c', fontWeight: 'bold' }}>
            {ticket.subject}
          </h4>
        </div>
      </div>
      
      {/* CUERPO EXPANDIBLE */}
      {!isMinimized && (
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '0 0 15px 0' }}>
            {ticket.description}
          </p>

          {/* PIE DE LA TARJETA: Prioridad a la izquierda y Move Task a la derecha */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: priorityColor, fontWeight: 'bold' }}>
              {ticket.priority.toUpperCase()}
            </span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(ticket.id);
              }}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: '#ccc', transition: 'color 0.2s',
                padding: '0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              move task →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}