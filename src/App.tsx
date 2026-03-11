import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import TicketForm from './components/TicketForm';
import TicketCard from './components/TicketCard';
import type { Ticket, Status, Priority } from './types/ticket';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('pro_tickets_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Referencias para las capturas de imagen
  const priorityBoxRef = useRef<HTMLDivElement>(null);
  const statusBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('pro_tickets_v3', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (t: Ticket) => setTickets([...tickets, t]);
  
  const deleteTicket = (id: string) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
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

  // --- Funciones de Exportación ---
  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = "dashboard_data.json";
    link.click();
  };

  const exportImage = (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (ref.current) {
      toPng(ref.current, { 
        backgroundColor: '#ffffff',
        style: { padding: '20px' } 
      })
      .then((url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.png`;
        link.click();
      });
    }
  };

  // --- Cálculos de Estadísticas ---
  const total = tickets.length;
  const getP = (p: Priority) => tickets.filter(t => t.priority === p).length;
  const getS = (s: Status) => tickets.filter(t => t.status === s).length;
  const pct = (c: number) => total > 0 ? Math.round((c / total) * 100) : 0;

  // Estilos reutilizables
  const btnActionStyle = {
    cursor: 'pointer',
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#4A5568',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ backgroundColor: '#F7FAFC', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Encabezado Principal */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          background: 'white', padding: '20px 30px', borderRadius: '16px', 
          marginBottom: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1A202C' }}>Pro Support Dashboard</h1>
            <p style={{ margin: '4px 0 0 0', color: '#A0AEC0', fontSize: '0.9rem' }}>Gestión de tickets y analíticas</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={exportJson} style={btnActionStyle}>📥 Export JSON</button>
            <button onClick={() => exportImage(priorityBoxRef, 'prioridades')} style={btnActionStyle}>📊 Export Priority</button>
            <button onClick={() => exportImage(statusBoxRef, 'estados')} style={btnActionStyle}>📈 Export Status</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px', marginBottom: '40px' }}>
          {/* Formulario */}
          <aside><TicketForm onAddTicket={addTicket} /></aside>
          
          {/* Tablero Kanban */}
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {(['Open', 'In Progress', 'Resolved'] as Status[]).map(status => (
              <div 
                key={status} 
                onDragOver={e => e.preventDefault()} 
                onDrop={e => handleDrop(e, status)} 
                style={{ background: '#EDF2F7', padding: '20px', borderRadius: '16px', minHeight: '600px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: status === 'Open' ? '#FF4D4D' : status === 'In Progress' ? '#FFA500' : '#48BB78' 
                    }}></div>
                    <h3 style={{ fontSize: '0.85rem', color: '#4A5568', fontWeight: 800, margin: 0 }}>{status.toUpperCase()}</h3>
                    <span style={{ marginLeft: 'auto', background: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', color: '#718096' }}>
                      {getS(status)}
                    </span>
                </div>
                {tickets.filter(t => t.status === status).map(t => (
                  <TicketCard key={t.id} ticket={t} onStatusChange={updateStatus} onDeleteTicket={deleteTicket} />
                ))}
              </div>
            ))}
          </main>
        </div>

        {/* Sección de Analíticas con Lógica de Ocultar 0% */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* GRÁFICO DE DONA (PRIORIDAD) */}
          <div ref={priorityBoxRef} style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginBottom: '30px', color: '#2D3748' }}>Priority Distribution</h3>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#F7FAFC" strokeWidth="3.5" />
                  
                  {/* Solo dibuja si el % es mayor a 0 */}
                  {pct(getP('High')) > 0 && (
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#FF4D4D" strokeWidth="3.5" 
                      strokeDasharray={`${pct(getP('High'))} 100`} strokeLinecap="round" />
                  )}
                  
                  {pct(getP('Medium')) > 0 && (
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#FFA500" strokeWidth="3.5" 
                      strokeDasharray={`${pct(getP('Medium'))} 100`} 
                      strokeDashoffset={`-${pct(getP('High'))}`} strokeLinecap="round" />
                  )}
                  
                  {pct(getP('Low')) > 0 && (
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#4DA6FF" strokeWidth="3.5" 
                      strokeDasharray={`${pct(getP('Low'))} 100`} 
                      strokeDashoffset={`-${pct(getP('High')) + pct(getP('Medium'))}`} strokeLinecap="round" />
                  )}
                </svg>
                
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2D3748' }}>{total}</div>
                    <div style={{ fontSize: '0.7rem', color: '#A0AEC0', fontWeight: 'bold' }}>TICKETS</div>
                </div>
            </div>
            
            {/* Leyendas dinámicas: ocultan prioridades con 0% */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.85rem', fontWeight: 600 }}>
              {pct(getP('High')) > 0 && <span style={{ color: '#FF4D4D' }}>● High: {pct(getP('High'))}%</span>}
              {pct(getP('Medium')) > 0 && <span style={{ color: '#FFA500' }}>● Med: {pct(getP('Medium'))}%</span>}
              {pct(getP('Low')) > 0 && <span style={{ color: '#4DA6FF' }}>● Low: {pct(getP('Low'))}%</span>}
            </div>
          </div>

          {/* GRÁFICO DE BARRAS (ESTADO) */}
          <div ref={statusBoxRef} style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginBottom: '30px', color: '#2D3748' }}>Tasks by Status</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', borderBottom: '2px solid #F7FAFC', paddingBottom: '10px' }}>
              <div style={{ width: '45px', height: `${pct(getS('Open'))}%`, background: 'linear-gradient(180deg, #9F7AEA 0%, #6B46C1 100%)', borderRadius: '8px 8px 0 0', transition: 'height 0.5s' }} />
              <div style={{ width: '45px', height: `${pct(getS('In Progress'))}%`, background: 'rgba(159, 122, 234, 0.5)', borderRadius: '8px 8px 0 0', transition: 'height 0.5s' }} />
              <div style={{ width: '45px', height: `${pct(getS('Resolved'))}%`, background: 'rgba(159, 122, 234, 0.2)', borderRadius: '8px 8px 0 0', transition: 'height 0.5s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem', marginTop: '15px', fontWeight: 700, color: '#718096' }}>
              <span>OPEN ({pct(getS('Open'))}%)</span>
              <span>PROGRESS ({pct(getS('In Progress'))}%)</span>
              <span>DONE ({pct(getS('Resolved'))}%)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;