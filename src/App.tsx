import { useState, useEffect } from 'react';
import TicketForm, { type Ticket, type Status, type Priority } from './components/TicketForm';
import TicketCard from './components/TicketCard';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('pro_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterPriority, setFilterPriority] = useState<'All' | Priority>('All');

  useEffect(() => {
    localStorage.setItem('pro_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (newTicket: Ticket) => setTickets([...tickets, newTicket]);

  const updateTicketStatus = (id: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const next: Record<Status, Status> = { 'Open': 'In Progress', 'In Progress': 'Resolved', 'Resolved': 'Open' };
        return { ...t, status: next[t.status] };
      }
      return t;
    }));
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    const id = e.dataTransfer.getData('ticketId');
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Función para exportar a JSON
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tickets_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredTickets = tickets.filter(t => filterPriority === 'All' || t.priority === filterPriority);

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header con Estadísticas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Pro Support Dashboard</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ textAlign: 'center', background: 'white', padding: '10px 20px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tickets.filter(t => t.status === 'Resolved').length}</div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>RESOLVED</div>
            </div>
            <button onClick={exportData} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ccc' }}>
              📥 Export JSON
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
          {/* Sidebar de Control */}
          <aside>
            <TicketForm onAddTicket={addTicket} />
            <div style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '12px' }}>
              <h4>Filters</h4>
              <select 
                style={{ width: '100%', padding: '8px' }}
                value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium Only</option>
                <option value="Low">Low Only</option>
              </select>
            </div>
          </aside>

          {/* Kanban Board */}
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {(['Open', 'In Progress', 'Resolved'] as Status[]).map(status => (
              <div 
                key={status} 
                onDragOver={e => e.preventDefault()} 
                onDrop={e => handleDrop(e, status)}
                style={{ background: '#DFE3E6', padding: '15px', borderRadius: '10px', minHeight: '60px' }}
              >
                <h3 style={{ fontSize: '0.8rem', color: '#5E6C84', marginBottom: '15px' }}>{status.toUpperCase()}</h3>
                {filteredTickets.filter(t => t.status === status).map(t => (
                  <TicketCard key={t.id} ticket={t} onStatusChange={updateTicketStatus} />
                ))}
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;