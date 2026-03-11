import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import TicketForm from './components/TicketForm';
import TicketCard from './components/TicketCard';
import { type Ticket, type Status, type Priority } from './types/ticket';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterPriority, setFilterPriority] = useState<'All' | Priority>('All');
  const [isLoaded, setIsLoaded] = useState(false);

  const priorityBoxRef = useRef<HTMLDivElement>(null);
  const statusBoxRef = useRef<HTMLDivElement>(null);

  // Carga inicial segura para evitar errores de hidratación en Vercel
  useEffect(() => {
    const saved = localStorage.getItem('pro_tickets_v4');
    if (saved) setTickets(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pro_tickets_v4', JSON.stringify(tickets));
    }
  }, [tickets, isLoaded]);

  const addTicket = (t: Ticket) => setTickets([...tickets, t]);
  
  const deleteTicket = (id: string) => {
    if (window.confirm('¿Eliminar este ticket?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const updateStatus = (id: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        const next: Record<Status, Status> = { 
          'Open': 'In Progress', 
          'In Progress': 'Resolved', 
          'Resolved': 'Open' 
        };
        return { ...t, status: next[t.status] };
      }
      return t;
    }));
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    const id = e.dataTransfer.getData('ticketId');
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const exportImage = (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
    if (ref.current) {
      toPng(ref.current, { backgroundColor: '#ffffff', style: { padding: '20px' } })
        .then((url) => {
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}.png`;
          link.click();
        });
    }
  };

  const filteredTickets = filterPriority === 'All' 
    ? tickets 
    : tickets.filter(t => t.priority === filterPriority);

  const total = tickets.length;
  const getP = (p: Priority) => tickets.filter(t => t.priority === p).length;
  const getS = (s: Status) => tickets.filter(t => t.status === s).length;
  const pct = (c: number) => total > 0 ? Math.round((c / total) * 100) : 0;

  if (!isLoaded) return null; // Evita parpadeos en el despliegue

  return (
    <div style={{ backgroundColor: '#F7FAFC', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Premium */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          background: 'white', padding: '20px 30px', borderRadius: '16px', 
          marginBottom: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1A202C', fontWeight: 800 }}>Pro Support Dashboard</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => exportImage(priorityBoxRef, 'prioridades')} style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 600 }}>📊 Export Priority</button>
            <button onClick={() => exportImage(statusBoxRef, 'estados')} style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 600 }}>📈 Export Status</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px', marginBottom: '40px' }}>
          
          {/* Columna Izquierda: Creación y Filtros */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TicketForm onAddTicket={addTicket} />
            
            {/* Sección de Filtros Estilo Imagen */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1A202C', fontSize: '1rem', fontWeight: 700 }}>Filters</h3>
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value as any)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: 600 }}
              >
                <option value="All">All Priorities</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium Only</option>
                <option value="Low">Low Only</option>
              </select>
            </div>
          </aside>
          
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {(['Open', 'In Progress', 'Resolved'] as Status[]).map(status => (
              <div key={status} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, status)} style={{ background: '#EDF2F7', padding: '20px', borderRadius: '20px', minHeight: '600px' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#4A5568', fontWeight: 800, marginBottom: '20px' }}>{status.toUpperCase()}</h3>
                {filteredTickets.filter(t => t.status === status).map(t => (
                  <TicketCard key={t.id} ticket={t} onStatusChange={updateStatus} onDeleteTicket={deleteTicket} />
                ))}
              </div>
            ))}
          </main>
        </div>

        {/* Gráficos con lógica de ocultar 0% */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div ref={priorityBoxRef} style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '30px', fontWeight: 700 }}>Priority Distribution</h3>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#F7FAFC" strokeWidth="3.5" />
                  {pct(getP('High')) > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#FF4D4D" strokeWidth="3.5" strokeDasharray={`${pct(getP('High'))} 100`} strokeLinecap="round" />}
                  {pct(getP('Medium')) > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#FFA500" strokeWidth="3.5" strokeDasharray={`${pct(getP('Medium'))} 100`} strokeDashoffset={`-${pct(getP('High'))}`} strokeLinecap="round" />}
                  {pct(getP('Low')) > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#4DA6FF" strokeWidth="3.5" strokeDasharray={`${pct(getP('Low'))} 100`} strokeDashoffset={`-${pct(getP('High')) + pct(getP('Medium'))}`} strokeLinecap="round" />}
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{total}</div>
                    <div style={{ fontSize: '0.7rem', color: '#A0AEC0' }}>TICKETS</div>
                </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {pct(getP('High')) > 0 && <span style={{ color: '#FF4D4D', fontWeight: 700 }}>● {pct(getP('High'))}%</span>}
              {pct(getP('Medium')) > 0 && <span style={{ color: '#FFA500', fontWeight: 700 }}>● {pct(getP('Medium'))}%</span>}
              {pct(getP('Low')) > 0 && <span style={{ color: '#4DA6FF', fontWeight: 700 }}>● {pct(getP('Low'))}%</span>}
            </div>
          </div>

          <div ref={statusBoxRef} style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '30px', fontWeight: 700 }}>Tasks by Status</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '150px', borderBottom: '2px solid #F7FAFC' }}>
              <div style={{ width: '40px', height: `${pct(getS('Open'))}%`, background: '#6B46C1', borderRadius: '8px 8px 0 0' }} />
              <div style={{ width: '40px', height: `${pct(getS('In Progress'))}%`, background: 'rgba(107, 70, 193, 0.5)', borderRadius: '8px 8px 0 0' }} />
              <div style={{ width: '40px', height: `${pct(getS('Resolved'))}%`, background: 'rgba(107, 70, 193, 0.2)', borderRadius: '8px 8px 0 0' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;