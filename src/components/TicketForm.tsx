import { useState } from 'react';

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Resolved';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: string; // Nueva propiedad para la Fase 3
  createdAt: string;
}

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
    if (!subject || !description || !assignedTo) return alert('Please fill all fields, including Agent name');

    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      subject,
      description,
      priority,
      status: 'Open',
      assignedTo,
      createdAt: new Date().toLocaleString(),
    };

    onAddTicket(newTicket);
    setSubject('');
    setDescription('');
    setAssignedTo('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', flexDirection: 'column', gap: '10px', background: 'white', 
      padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ margin: '0' }}>Create Pro Ticket</h3>
      <input 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} 
        placeholder="Agent Name (e.g. Maria G.)" 
      />
      <input 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        value={subject} onChange={(e) => setSubject(e.target.value)} 
        placeholder="Ticket Subject" 
      />
      <select 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <textarea 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
        value={description} onChange={(e) => setDescription(e.target.value)} 
        placeholder="Describe the problem..."
      />
      <button type="submit" style={{ 
        backgroundColor: '#4A90E2', color: 'white', border: 'none', 
        padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' 
      }}>
        Add to Queue
      </button>
    </form>
  );
}