import { useState } from 'react';
import { Ticket, Priority } from '../types/ticket';

interface Props {
  onAddTicket: (ticket: Ticket) => void;
}

export default function TicketForm({ onAddTicket }: Props) {
  // 1. Definimos el "Estado" (la memoria temporal del formulario)
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  // 2. Función que se ejecuta al darle al botón "Create Ticket"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (!subject || !description) return alert('Please fill all fields');

    // Creamos el objeto del nuevo ticket
    const newTicket: Ticket = {
      id: crypto.randomUUID(), // Genera un ID único automáticamente
      subject,
      description,
      priority,
      status: 'Open',
      createdAt: new Date().toLocaleString('en-US'),
    };

    onAddTicket(newTicket); // "Enviamos" el ticket al padre (App.tsx)
    
    // Limpiamos el formulario
    setSubject('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <h3>New Support Ticket</h3>
      
      <div>
        <label>Subject</label>
        <input 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="Issue title"
        />
      </div>

      <div>
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label>Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>

      <button type="submit">Create Ticket</button>
    </form>
  );
}