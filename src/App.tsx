import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import TicketForm from './components/TicketForm';
import TicketCard from './components/TicketCard';
import { type Ticket, type Status, type Priority } from './types/ticket'; 

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterPriority, setFilterPriority] = useState<'All' | Priority>('All');
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const priorityBoxRef = useRef<HTMLDivElement>(null);
  const statusBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pro_tickets_final');
    const savedTheme = localStorage.getItem('theme_dark');
    if (saved) setTickets(JSON.parse(saved));
    if (savedTheme) setDarkMode(savedTheme === 'true');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = darkMode ? '#1A202C' : '#F8FAFC';
    document.body.style.transition = 'background-color 0.3s ease';
  }, [darkMode]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pro_tickets_final', JSON.stringify(tickets));
      localStorage.setItem('theme_dark', darkMode.toString());
    }
  }, [tickets, isLoaded, darkMode]);

  const theme = {
    bg: darkMode ? '#1A202C' : '#F8FAFC',
    card: darkMode ? '#2D3748' : '#FFFFFF',
    text: darkMode ? '#F7FAFC' : '#1A202C',
    subtext: darkMode ? '#A0AEC0' : '#718096',
    border: darkMode ? '#4A5568' : '#E2E8F0',
    kanbanBg: darkMode ? '#262d3d' : '#EDF2F7'
  };

  const addTicket = (t: Ticket) => setTickets([...tickets, t]);
  
  const deleteTicket = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ticket permanentemente?')) {
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

  // FUNCIÓN PARA DESCARGAR JSON
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tickets_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportImage = (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (ref.current) {
      toPng(ref.current, { backgroundColor: theme.card, style: { padding: '30px' } })
      .then((url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-${name}.png`;
        link.click();
      });
    }
  };

  const filteredTickets = filterPriority === 'All' ? tickets : tickets.filter(t => t.priority === filterPriority);
  const total = tickets.length;
  const getP = (p: Priority) => tickets.filter(t => t.priority === p).length;
  const getS = (s: Status) => tickets.filter(t => t.status === s).length;
  const pct = (c: number) => total > 0 ? Math.round((c / total) * 100) : 0;

  if (!isLoaded) return null;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '40px 20px', color: theme.text, transition: 'all 0.3s ease', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.card, padding: '24px 35px', borderRadius: '20px', marginBottom: '40px', border: `1px solid ${theme.border}` }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Pro Support Dashboard</h1>
            <p style={{ margin: '5px 0 0 0', color: theme.subtext, fontSize: '0.9rem' }}>Manage and monitor your support tickets</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* BOTÓN JSON AÑADIDO AL COSTADO */}
            <button 
              onClick={downloadJSON} 
              title="Download Backup"
              style={{ cursor: 'pointer', padding: '12px 18px', borderRadius: '14px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              📥 JSON
            </button>
            <button onClick={() => setDarkMode(!darkMode)} style={{ cursor: 'pointer', padding: '12px', borderRadius: '14px', border: `1px solid ${theme.border}`, background: theme.card, fontSize: '1.2rem' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '35px', marginBottom: '50px' }}>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <TicketForm onAddTicket={addTicket} isDark={darkMode} />
            <div style={{ background: theme.card, padding: '28px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 700 }}>Quick Filters</h3>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: theme.subtext, marginBottom: '8px' }}>PRIORITY STATUS</label>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontWeight: 600, outline: 'none' }}>
                <option value="All">All Tickets</option>
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟠 Medium Priority</option>
                <option value="Low">🔵 Low Priority</option>
              </select>
            </div>
          </aside>
          
          <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
            {(['Open', 'In Progress', 'Resolved'] as Status[]).map(status => (
              <div key={status} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, status)} style={{ background: theme.kanbanBg, padding: '25px 20px', borderRadius: '24px', minHeight: '700px', border: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <h3 style={{ fontSize: '0.8rem', color: theme.subtext, fontWeight: 800, letterSpacing: '1px' }}>{status.toUpperCase()}</h3>
                  <span style={{ background: theme.border, padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>{tickets.filter(t => t.status === status).length}</span>
                </div>
                {filteredTickets.filter(t => t.status === status).map(t => (
                  <TicketCard key={t.id} ticket={t} onStatusChange={updateStatus} onDeleteTicket={deleteTicket} isDark={darkMode} />
                ))}
              </div>
            ))}
          </main>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
          <div ref={priorityBoxRef} style={{ background: theme.card, padding: '45px', borderRadius: '28px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
            <h3 style={{ marginBottom: '35px', fontWeight: 700 }}>Priority Distribution</h3>
            <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}>
                {total > 0 ? (
                  <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%' }}>
                    <circle cx="18" cy="18" r="16" fill="none" stroke={darkMode ? '#334155' : '#F7FAFC'} strokeWidth="3.5" />
                    {getP('High') > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#FF4D4D" strokeWidth="3.5" strokeDasharray={`${pct(getP('High'))} 100`} strokeLinecap="round" />}
                    {getP('Medium') > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#FFA500" strokeWidth="3.5" strokeDasharray={`${pct(getP('Medium'))} 100`} strokeDashoffset={`-${pct(getP('High'))}`} strokeLinecap="round" />}
                    {getP('Low') > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#4DA6FF" strokeWidth="3.5" strokeDasharray={`${pct(getP('Low'))} 100`} strokeDashoffset={`-${pct(getP('High')) + pct(getP('Medium'))}`} strokeLinecap="round" />}
                  </svg>
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `2px dashed ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.subtext }}>No Data</div>
                )}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>{total}</span>
                </div>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem' }}>
              <span style={{ color: '#FF4D4D', fontWeight: 700 }}>● High {pct(getP('High'))}%</span>
              <span style={{ color: '#FFA500', fontWeight: 700 }}>● Medium {pct(getP('Medium'))}%</span>
              <span style={{ color: '#4DA6FF', fontWeight: 700 }}>● Low {pct(getP('Low'))}%</span>
            </div>
          </div>

          <div ref={statusBoxRef} style={{ background: theme.card, padding: '45px', borderRadius: '28px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
            <h3 style={{ marginBottom: '35px', fontWeight: 700 }}>Workflow Analysis</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', borderBottom: `2px solid ${theme.border}`, paddingBottom: '10px' }}>
                <div style={{ width: '50px', height: `${pct(getS('Open'))}%`, background: '#6B46C1', borderRadius: '10px 10px 0 0' }} />
                <div style={{ width: '50px', height: `${pct(getS('In Progress'))}%`, background: '#9F7AEA', borderRadius: '10px 10px 0 0' }} />
                <div style={{ width: '50px', height: `${pct(getS('Resolved'))}%`, background: '#B794F4', borderRadius: '10px 10px 0 0' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', fontWeight: 800, color: theme.subtext, fontSize: '0.75rem' }}>
              <span>OPEN {pct(getS('Open'))}%</span>
              <span>PROGRESS {pct(getS('In Progress'))}%</span>
              <span>RESOLVED {pct(getS('Resolved'))}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;