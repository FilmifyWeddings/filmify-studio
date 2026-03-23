import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, Loader2 } from 'lucide-react';

const API_URL = "YOUR_APPS_SCRIPT_URL_HERE";

export default function App() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  const sync = async (action: string, client: any) => {
    const updated = action === 'add' ? [...clients, client] :
                    action === 'delete' ? clients.filter(c => c.ID !== client.ID) :
                    clients.map(c => c.ID === client.ID ? client : c);
    setClients(updated);
    
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action, ...client })
    });
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-black">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      <p className="text-[10px] tracking-[0.4em] text-zinc-600 uppercase">Filmify Studio</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-black">
      <header className="flex justify-between items-center mb-12 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Camera className="text-black w-5 h-5" />
          </div>
          <h1 className="text-2xl font-light tracking-tighter">FILMIFY</h1>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold tracking-widest active:scale-90 transition-all"
        >
          + NEW
        </button>
      </header>

      <div className="space-y-6">
        {clients.map(c => (
          <motion.div 
            layout 
            key={c.ID} 
            className={`glass p-8 rounded-[2rem] transition-all duration-700 ${c.Secure ? 'secure-glow' : ''}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-mono mb-1">{c.Date} • {c.Type}</p>
                <h2 className="text-xl font-light">{c.Name}</h2>
              </div>
              <button onClick={() => sync('delete', c)} className="text-zinc-800 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[8px] text-zinc-600 uppercase mb-1">Storage</p>
                <select 
                  value={c.Storage} 
                  onChange={e => sync('update', {...c, Storage: e.target.value})}
                  className="bg-transparent text-xs w-full outline-none"
                >
                  <option value="HDD 01">HDD 01</option>
                  <option value="SSD 01">SSD 01</option>
                  <option value="CLOUD">CLOUD</option>
                </select>
              </div>
              <button 
                onClick={() => sync('update', {...c, Secure: !c.Secure})}
                className={`flex-1 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${c.Secure ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}
              >
                {c.Secure ? 'SECURED' : 'MARK SECURE'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
          >
            <div className="w-full max-w-sm glass p-10 rounded-[2.5rem]">
              <h3 className="text-2xl font-light mb-8 tracking-tight">New Project</h3>
              <input id="n" placeholder="Client Name" className="w-full bg-transparent text-lg mb-6 border-b border-white/10 pb-2 outline-none" />
              <input id="d" type="date" className="w-full bg-transparent text-lg mb-10 border-b border-white/10 pb-2 outline-none" />
              <div className="flex gap-4">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-4 text-zinc-500 text-xs uppercase tracking-widest">Cancel</button>
                <button 
                  onClick={() => {
                    const n = (document.getElementById('n') as HTMLInputElement).value;
                    const d = (document.getElementById('d') as HTMLInputElement).value;
                    if(n && d) {
                      sync('add', { ID: Date.now().toString(), Name: n, Date: d, Type: 'Wedding', Storage: 'HDD 01', Secure: false, Links: "{}" });
                      setIsAddOpen(false);
                    }
                  }}
                  className="flex-1 py-4 bg-white text-black rounded-full text-[10px] font-bold tracking-widest active:scale-95 transition-transform"
                >
                  CREATE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
