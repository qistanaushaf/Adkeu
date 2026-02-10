
import React, { useState, useRef } from 'react';
import { Month, PaguEntry } from '../types';
import { MONTHS, INPUT_DIVISI_LIST } from '../constants';
import { Plus, Trash2, Search, Upload, X, AlertTriangle, Edit3, Save, PiggyBank } from 'lucide-react';

interface PaguManagerProps {
  paguEntries: PaguEntry[];
  totalBudget: number;
  isAdmin: boolean;
  onUpdateBudget: (val: number) => void;
  onAdd: (entry: PaguEntry) => void;
  onEdit: (id: string, entry: PaguEntry) => void;
  onDelete: (id: string) => void;
}

const PaguManager: React.FC<PaguManagerProps> = ({ paguEntries, totalBudget, isAdmin, onUpdateBudget, onAdd, onEdit, onDelete }) => {
  const [activeMonth, setActiveMonth] = useState<Month>(MONTHS[new Date().getMonth()]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPagu, setEditingPagu] = useState<PaguEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetVal, setBudgetVal] = useState(totalBudget.toString());

  // Form State
  const [nominal, setNominal] = useState('');
  const [divisi, setDivisi] = useState(INPUT_DIVISI_LIST[0]);
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMonthData = paguEntries.filter(e => e.month === activeMonth && (
    e.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const totalSpent = paguEntries.reduce((acc, p) => acc + p.nominal, 0);
  const remainingBudget = totalBudget - totalSpent;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setNominal('');
    setDivisi(INPUT_DIVISI_LIST[0]);
    setDesc('');
    setPhoto(null);
    setEditingPagu(null);
  };

  const startEdit = (e: PaguEntry) => {
    setEditingPagu(e);
    setNominal(e.nominal.toString());
    setDivisi(INPUT_DIVISI_LIST.includes(e.divisi) ? e.divisi : INPUT_DIVISI_LIST[0]);
    setDesc(e.description);
    setPhoto(e.photoUrl);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData: PaguEntry = {
      id: editingPagu?.id || Math.random().toString(36).substr(2, 9),
      nominal: parseFloat(nominal),
      divisi,
      description: desc,
      photoUrl: photo || 'https://via.placeholder.com/400x300?text=No+Photo',
      month: activeMonth,
      createdAt: editingPagu?.createdAt || new Date().toISOString()
    };

    if (editingPagu) {
      onEdit(editingPagu.id, entryData);
    } else {
      onAdd(entryData);
    }

    setShowAddModal(false);
    clearForm();
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleSaveBudget = () => {
    onUpdateBudget(parseFloat(budgetVal) || 0);
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Pengelolaan Dana Pagu</h2>
          <p className="text-slate-500 font-medium">Monitoring Anggaran Divisi HIMAHI UB 2026</p>
        </div>
        {isAdmin && (
          <button onClick={() => { clearForm(); setShowAddModal(true); }} className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest">
            <Plus className="w-5 h-5 inline mr-2" /> Input Pagu
          </button>
        )}
      </header>

      {/* Budget Control Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-center border border-slate-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Anggaran Pagu</p>
              {isEditingBudget ? (
                <div className="flex gap-2 mt-1">
                  <input 
                    type="number" 
                    className="bg-slate-800 border-none rounded-lg px-3 py-1 text-lg font-black outline-none w-32" 
                    value={budgetVal} 
                    onChange={(e) => setBudgetVal(e.target.value)} 
                    autoFocus
                  />
                  <button onClick={handleSaveBudget} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"><Save className="w-4 h-4"/></button>
                </div>
              ) : (
                <h3 className="text-2xl font-black">Rp {totalBudget.toLocaleString('id-ID')}</h3>
              )}
            </div>
            {isAdmin && !isEditingBudget && (
              <button onClick={() => setIsEditingBudget(true)} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                <Edit3 className="w-4 h-4 text-slate-300" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo Pagu Tersisa</p>
          <div className="flex items-center gap-3">
            <h3 className={`text-2xl font-black ${remainingBudget < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              Rp {remainingBudget.toLocaleString('id-ID')}
            </h3>
            {remainingBudget < 0 && <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Tabs Bulan */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-200/50 rounded-2xl scrollbar-hide">
        {MONTHS.map((m) => (
          <button key={m} onClick={() => setActiveMonth(m)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeMonth === m ? 'bg-blue-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari divisi atau keterangan..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5">Divisi</th>
                <th className="px-6 py-5">Nominal</th>
                <th className="px-6 py-5">Keterangan</th>
                <th className="px-6 py-5">Bukti</th>
                {isAdmin && <th className="px-6 py-5 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentMonthData.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-800">{e.divisi}</td>
                  <td className="px-6 py-5 font-black text-blue-600">Rp {e.nominal.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">{e.description}</td>
                  <td className="px-6 py-5">
                    <button onClick={() => window.open(e.photoUrl, '_blank')} className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border">
                      <img src={e.photoUrl} className="w-full h-full object-cover" alt="Proof" />
                    </button>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => startEdit(e)} className="p-2 text-slate-300 hover:text-blue-500 transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(e.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {currentMonthData.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center text-slate-300 font-bold text-[10px] uppercase tracking-widest">Data Pagu Kosong</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Hapus Entri Pagu?</h3>
            <p className="text-slate-500 text-sm mb-8">Data pengeluaran pagu divisi ini akan dihapus permanen dari arsip bulan {activeMonth}.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs uppercase hover:bg-slate-100">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-rose-600 shadow-lg shadow-rose-500/20">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 leading-none">{editingPagu ? 'Edit' : 'Input'} Dana Pagu</h3>
              <button onClick={() => { setShowAddModal(false); clearForm(); }} className="p-2 text-slate-400"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Divisi Pengaju</label>
                  <select 
                    required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" 
                    value={divisi} 
                    onChange={(e) => setDivisi(e.target.value)}
                  >
                    {INPUT_DIVISI_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal (IDR)</label>
                  <input type="number" required placeholder="Nominal" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none" value={nominal} onChange={(e) => setNominal(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bukti Pengeluaran</label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 overflow-hidden transition-all hover:border-blue-300">
                  {photo ? <img src={photo} className="w-full h-full object-cover" /> : <><Upload className="w-8 h-8 text-slate-200 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase">Klik untuk upload bukti</p></>}
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keterangan</label>
                <textarea rows={3} placeholder="Keterangan pengeluaran..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none resize-none" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 shadow-xl transition-all">
                {editingPagu ? 'Simpan Perubahan' : 'Simpan Pagu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaguManager;
