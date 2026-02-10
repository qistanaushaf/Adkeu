
import React, { useState, useRef } from 'react';
import { Month, NonCashEvidence } from '../types';
import { MONTHS } from '../constants';
import { Plus, Trash2, Edit2, ImageIcon, Upload, FileText, Check, AlertTriangle, X } from 'lucide-react';

interface NonCashManagerProps {
  evidenceList: NonCashEvidence[];
  onAdd: (evidence: NonCashEvidence) => void;
  onUpdate: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const NonCashManager: React.FC<NonCashManagerProps> = ({ evidenceList, onAdd, onUpdate, onDelete }) => {
  const [activeMonth, setActiveMonth] = useState<Month>(MONTHS[new Date().getMonth()]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMonthEvidence = evidenceList.filter(e => e.month === activeMonth);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newEvidence: NonCashEvidence = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.split('.')[0] || 'Transaksi Non-Kas',
        imageUrl: URL.createObjectURL(file),
        month: activeMonth,
        uploadedAt: new Date().toISOString()
      };
      onAdd(newEvidence);
    }
  };

  const startEditing = (evidence: NonCashEvidence) => {
    setEditingId(evidence.id);
    setEditValue(evidence.title);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editValue);
      setEditingId(null);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Dokumentasi Non-Kas</h2>
          <p className="text-slate-500 font-medium">Monitoring Bukti Transaksi HIMAHI UB 2026</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl transition-all uppercase tracking-widest">
          <Upload className="w-5 h-5" /> Upload Bukti
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      </header>

      {/* Tabs Bulan */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-200/50 rounded-2xl scrollbar-hide">
        {MONTHS.map((m) => (
          <button key={m} onClick={() => setActiveMonth(m)} className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeMonth === m ? 'bg-blue-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentMonthEvidence.map((e) => (
          <div key={e.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="relative h-64 bg-slate-50 overflow-hidden">
              <img src={e.imageUrl} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-blue-600 border">
                  {activeMonth}
                </span>
              </div>
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => window.open(e.imageUrl, '_blank')} className="p-3 bg-white text-slate-900 rounded-2xl shadow-xl"><ImageIcon /></button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {editingId === e.id ? (
                    <div className="flex gap-2">
                      <input className="flex-1 bg-slate-50 border-2 border-blue-500 rounded-xl px-4 py-2 text-sm font-bold outline-none" value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                      <button onClick={saveEdit} className="p-2 bg-emerald-500 text-white rounded-xl"><Check className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{e.title}</h3>
                  )}
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Diunggah: {new Date(e.uploadedAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button onClick={() => startEditing(e)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit2 className="w-4 h-4" /> Rename</button>
                <button onClick={() => setDeleteId(e.id)} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Hapus Dokumentasi?</h3>
            <p className="text-slate-500 text-sm mb-8">Bukti transaksi dokumentasi non-kas ini akan dihapus permanen dari sistem bulan {activeMonth}.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs uppercase hover:bg-slate-100">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-rose-600 shadow-lg shadow-rose-500/20">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentMonthEvidence.length === 0 && (
        <div className="py-32 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">Belum ada dokumentasi</div>
      )}
    </div>
  );
};

export default NonCashManager;
