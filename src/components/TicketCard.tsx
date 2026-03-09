import { type Ticket } from './TicketForm';

interface Props {
  ticket: Ticket;
  onStatusChange: (id: string) => void;
}

export default function TicketCard({ ticket, onStatusChange }: Props) {
  const priorityColor = ticket.priority === 'High' ? '#FF4D4D' : ticket.priority === 'Medium' ? '#FFA500' : '#4DA6FF';

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket.id)}
      onClick={() => onStatusChange(ticket.id)}
      style={{
        background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `5px solid ${priorityColor}`,
        cursor: 'grab'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ 
          width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eee',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
        }}>
          {ticket.assignedTo[0]?.toUpperCase()}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>{ticket.assignedTo}</span>
      </div>
      
      <h4 style={{ margin: '0 0 5px 0' }}>{ticket.subject}</h4>
      <p style={{ fontSize: '0.8rem', color: '#888', margin: '0' }}>{ticket.description}</p>
      
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: priorityColor, fontWeight: 'bold' }}>{ticket.priority}</span>
        <span style={{ fontSize: '0.6rem', color: '#ccc' }}>{ticket.createdAt.split(',')[0]}</span>
      </div>
    </div>
  );
}