
import React, { useState } from 'react';
import { Month, DivisiKasContainer, MemberKas } from '../types';
import { MONTHS } from '../constants';
import { Trash2, Search, UserPlus, Table, AlertTriangle, ExternalLink, Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FormManagerProps {
  isAdmin: boolean;
  data: DivisiKasContainer;
  onUpdate: (newData: DivisiKasContainer) => void;
}

const DIVISIONS = [
  "Kahim/Wakahim",
  "Secretariat Adm",
  "Financial Adm",
  "Creative Economy",
  "Domestic Affairs",
  "Foreign Affairs",
  "Human Resource and Development",
  "Media and Information",
  "Organizing Refreshment",
  "Research and Development",
  "Social Affairs"
];

const FormManager: React.FC<FormManagerProps> = ({ isAdmin, data, onUpdate }) => {
  const [activeDivisi, setActiveDivisi] = useState<string>(DIVISIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const members = data[activeDivisi] || [];
  const googleFormLink = "https://docs.google.com/spreadsheets/d/1Xy_JpE_pW6-vE9R-JzLp-T4F-tH_J4D-K8-Y-A-A-A/edit";

  const handleManualSave = () => {
    setIsSaving(true);
    onUpdate({...data}); 
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleAddMember = () => {
    if (!isAdmin) return;
    const newMember: MemberKas = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      payments: {},
      lateStatus: {}
    };
    onUpdate({
      ...data,
      [activeDivisi]: [...members, newMember]
    });
  };

  const handleUpdateName = (id: string, name: string) => {
    if (!isAdmin) return;
    const updatedMembers = members.map(m => m.id === id ? { ...m, name } : m);
    onUpdate({ ...data, [activeDivisi]: updatedMembers });
  };

  const handleTogglePayment = (memberId: string, month: Month) => {
    if (!isAdmin) return;
    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        const newPaidStatus = !m.payments[month];
        return {
          ...m,
          payments: {
            ...m.payments,
            [month]: newPaidStatus
          }
        };
      }
      return m;
    });
    onUpdate({ ...data, [activeDivisi]: updatedMembers });
  };

  const handleToggleLate = (e: React.MouseEvent | React.TouchEvent, memberId: string, month: Month) => {
    if (e.type === 'contextmenu') e.preventDefault();
    if (!isAdmin) return;
    
    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        const currentLateStatus = m.lateStatus?.[month] || false;
        return {
          ...m,
          lateStatus: {
            ...(m.lateStatus || {}),
            [month]: !currentLateStatus
          }
        };
      }
      return m;
    });
    onUpdate({ ...data, [activeDivisi]: updatedMembers });
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedMembers = members.filter(m => m.id !== deleteId);
      onUpdate({ ...data, [activeDivisi]: updatedMembers });
      setDeleteId(null);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Database Kas Mahasiswa</h2>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-slate-500 dark:text-slate-400 font-medium">Tracking Iuran Kas Per Divisi HIMAHI UB 2026.</p>
             <div className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
             <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Auto-Save Aktif</span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {isAdmin && (
            <button 
              onClick={handleManualSave}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs transition-all uppercase tracking-widest shadow-lg ${isSaving ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}
            >
              {isSaving ? <CheckCircle className="w-4 h-4 animate-in zoom-in" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Tersimpan' : 'Simpan Database'}
            </button>
          )}
          <button 
            onClick={() => window.open(googleFormLink, '_blank')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg"
          >
            <ExternalLink className="w-4 h-4" /> Buka Respons Form
          </button>
          {isAdmin && (
            <button 
              onClick={handleAddMember}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest"
            >
              <UserPlus className="w-4 h-4" /> Tambah Anggota
            </button>
          )}
        </div>
      </div>

      {/* Division Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-200/50 dark:bg-slate-900 rounded-2xl scrollbar-hide">
        {DIVISIONS.map((div) => (
          <button 
            key={div} 
            onClick={() => setActiveDivisi(div)} 
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeDivisi === div ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800'}`}
          >
            {div}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-colors duration-500">
        <div className="bg-slate-900 dark:bg-slate-950 text-white py-4 px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Table className="w-5 h-5 text-yellow-400" />
            <h3 className="font-black text-sm uppercase tracking-widest">Tracking Kas ({activeDivisi})</h3>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                <Clock className="w-3 h-3"/> 
                <span>Tandai <b>TELAT (MERAH)</b></span>
              </div>
            )}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white/10 border-none rounded-lg text-xs outline-none focus:bg-white/20 transition-all placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center border-b dark:border-slate-800">
                <th className="px-4 py-4 border-r dark:border-slate-800 w-12 text-center">No.</th>
                <th className="px-6 py-4 border-r dark:border-slate-800 min-w-[200px] text-left">Nama</th>
                {MONTHS.map(m => (
                  <th key={m} className="px-2 py-4 border-r dark:border-slate-800 w-16 text-center">{m.substr(0, 3)}</th>
                ))}
                {isAdmin && <th className="px-4 py-4 w-12"></th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredMembers.map((member, index) => (
                <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3 border-r dark:border-slate-800 text-center text-xs font-bold text-slate-400 dark:text-slate-600">{index + 1}</td>
                  <td className="px-6 py-3 border-r dark:border-slate-800">
                    {isAdmin ? (
                      <input 
                        type="text" 
                        value={member.name} 
                        onChange={(e) => handleUpdateName(member.id, e.target.value)}
                        placeholder="Masukkan nama..."
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-200 dark:placeholder:text-slate-700 outline-none"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{member.name || '---'}</span>
                    )}
                  </td>
                  {MONTHS.map(m => {
                    const isPaid = member.payments[m] || false;
                    const isLate = member.lateStatus?.[m] || false;
                    const showLateUI = isLate;
                    
                    return (
                      <td 
                        key={m} 
                        className={`px-2 py-3 border-r dark:border-slate-800 text-center transition-all cursor-pointer relative ${showLateUI ? 'bg-red-600' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}`}
                        onContextMenu={(e) => handleToggleLate(e, member.id, m)}
                        onDoubleClick={(e) => handleToggleLate(e, member.id, m)}
                      >
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={isPaid}
                            onChange={() => handleTogglePayment(member.id, m)}
                            disabled={!isAdmin}
                            className={`w-5 h-5 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed transition-all ${showLateUI ? 'border-white bg-white/40 ring-2 ring-white/50' : ''}`}
                          />
                        </div>
                        {showLateUI && isAdmin && (
                          <div className="absolute -top-1 -right-1">
                            <AlertCircle className="w-3 h-3 text-white fill-red-600" />
                          </div>
                        )}
                        {showLateUI && isPaid && (
                          <div className="absolute bottom-0 right-0 p-0.5">
                            <CheckCircleIcon className="w-2.5 h-2.5 text-white/70" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setDeleteId(member.id)}
                        className="p-1.5 text-slate-200 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={15} className="py-20 text-center text-slate-300 dark:text-slate-700 font-bold uppercase text-[10px] tracking-widest">
                    Belum ada data anggota untuk divisi ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hapus Anggota?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Data tracking kas untuk anggota ini akan dihapus secara permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold text-xs uppercase hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-rose-600 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default FormManager;
