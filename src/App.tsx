import { useState } from 'react';

import TicketForm from './components/TicketForm';
// Definición temporal directa para saltarnos el error de importación
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Resolved';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}
function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const addTicket = (newTicket: Ticket) => {
    setTickets([...tickets, newTicket]);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px', 
      backgroundColor: '#f4f4f9',
      borderRadius: '8px',
      minHeight: '100vh',
      color: '#333' 
    }}>
      <h1 style={{ color: '#2c3e50' }}>Support Tickets Dashboard</h1>
      
      <section style={{ marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <TicketForm onAddTicket={addTicket} />
      </section>

      <hr />

      <h2>Active Tickets ({tickets.length})</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {tickets.length === 0 ? (
          <p>No tickets yet. Create one above!</p>
        ) : (
          tickets.map((t) => (
            <div key={t.id} style={{ 
              padding: '15px', 
              borderLeft: `5px solid ${t.priority === 'High' ? 'red' : 'orange'}`,
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <strong>{t.subject}</strong> 
              <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: '#666' }}>({t.priority})</span>
              <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{t.description}</p>
              <small style={{ color: '#999' }}>Status: {t.status}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;