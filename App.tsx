
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, FileSpreadsheet, Database, Menu, X, Landmark, CheckCircle, 
  Sun, Moon, Sunrise, Sunset 
} from 'lucide-react';
import SpreadsheetManager from './components/SpreadsheetManager';
import FormManager from './components/FormManager';
import Dashboard from './components/Dashboard';
import PaguManager from './components/PaguManager';
import { MonthlyData, Month, DivisiKasContainer, PaguEntry } from './types';
import { MONTHS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'spreadsheet' | 'form' | 'pagu'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  
  // Data States
  const [financeData, setFinanceData] = useState<MonthlyData[]>(() => {
    const saved = localStorage.getItem('himahi_finance');
    return saved ? JSON.parse(saved) : MONTHS.map(m => ({ month: m, transactions: [] }));
  });
  const [divisiKasData, setDivisiKasData] = useState<DivisiKasContainer>(() => {
    const saved = localStorage.getItem('himahi_divisi_kas');
    return saved ? JSON.parse(saved) : {};
  });
  const [paguEntries, setPaguEntries] = useState<PaguEntry[]>(() => {
    const saved = localStorage.getItem('himahi_pagu_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalPaguBudget, setTotalPaguBudget] = useState<number>(() => {
    const saved = localStorage.getItem('himahi_total_pagu_budget');
    return saved ? parseFloat(saved) : 0;
  });

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('himahi_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Greeting Logic
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return { text: 'Selamat Pagi', icon: <Sunrise className="w-5 h-5 text-amber-500" /> };
    if (hour >= 11 && hour < 15) return { text: 'Selamat Siang', icon: <Sun className="w-5 h-5 text-yellow-500" /> };
    if (hour >= 15 && hour < 18) return { text: 'Selamat Sore', icon: <Sunset className="w-5 h-5 text-orange-500" /> };
    return { text: 'Selamat Malam', icon: <Moon className="w-5 h-5 text-indigo-400" /> };
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('himahi_theme', theme);
  }, [theme]);

  // Local Persistence
  useEffect(() => {
    localStorage.setItem('himahi_finance', JSON.stringify(financeData));
    localStorage.setItem('himahi_divisi_kas', JSON.stringify(divisiKasData));
    localStorage.setItem('himahi_pagu_entries', JSON.stringify(paguEntries));
    localStorage.setItem('himahi_total_pagu_budget', totalPaguBudget.toString());
    
    setSaveStatus(true);
    const timer = setTimeout(() => setSaveStatus(false), 2000);
    return () => clearTimeout(timer);
  }, [financeData, divisiKasData, paguEntries, totalPaguBudget]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Dalam mode terbuka, semua fitur pengeditan diaktifkan (isAdmin = true)
  const isAdmin = true;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-500">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-blue-900 dark:bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center">
            {greetingInfo.icon}
          </div>
          <span className="font-black text-sm leading-none">{greetingInfo.text}</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex flex-col bg-blue-950 dark:bg-slate-900 text-white w-full md:w-64 min-h-screen p-6 gap-8 fixed md:sticky top-0 z-40 shadow-xl transition-colors duration-500
      `}>
        <div className="hidden md:flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center">
              {greetingInfo.icon}
            </div>
            <h1 className="font-black text-lg leading-tight tracking-tight">{greetingInfo.text}</h1>
          </div>
          <p className="text-blue-300 dark:text-slate-500 text-[10px] uppercase font-bold tracking-tighter">HIMAHI UB 2026</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-blue-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-3">Menu</p>
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={<FileSpreadsheet className="w-5 h-5" />} 
            label="Dana Hibah" 
            active={activeTab === 'spreadsheet'} 
            onClick={() => { setActiveTab('spreadsheet'); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={<Landmark className="w-5 h-5" />} 
            label="Dana Pagu" 
            active={activeTab === 'pagu'} 
            onClick={() => { setActiveTab('pagu'); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={<Database className="w-5 h-5" />} 
            label="Database Kas" 
            active={activeTab === 'form'} 
            onClick={() => { setActiveTab('form'); setIsMobileMenuOpen(false); }} 
          />
        </div>

        <div className="mt-auto pt-6 border-t border-blue-900/50 dark:border-slate-800 space-y-4">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-900/40 dark:bg-slate-800/50 hover:bg-blue-800 transition-all text-xs font-bold"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full w-fit">
            <CheckCircle className={`w-3 h-3 ${saveStatus ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">Auto-Saved</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-12 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            financeData={financeData} 
            paguData={paguEntries} 
            totalPaguBudget={totalPaguBudget}
          />
        )}
        {activeTab === 'spreadsheet' && (
          <SpreadsheetManager 
            data={financeData} 
            isAdmin={isAdmin}
            onUpdate={(month, updater) => {
              setFinanceData(prev => prev.map(m => m.month === month ? updater(m) : m));
            }} 
          />
        )}
        {activeTab === 'pagu' && (
          <PaguManager 
            isAdmin={isAdmin} 
            paguEntries={paguEntries}
            totalBudget={totalPaguBudget}
            onUpdateBudget={(val) => setTotalPaguBudget(val)}
            onAdd={(entry) => setPaguEntries(prev => [entry, ...prev])}
            onEdit={(id, entry) => setPaguEntries(prev => prev.map(e => e.id === id ? { ...entry, id } : e))}
            onDelete={(id) => setPaguEntries(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'form' && (
          <FormManager 
            isAdmin={isAdmin} 
            data={divisiKasData}
            onUpdate={(newData) => setDivisiKasData(newData)}
          />
        )}
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-yellow-500 text-blue-950 font-bold shadow-lg shadow-yellow-500/20' 
        : 'hover:bg-blue-900/50 dark:hover:bg-slate-800/50 text-blue-100/70 hover:text-white dark:text-slate-400 dark:hover:text-white'}
    `}
  >
    <span className={`${active ? 'text-blue-950' : 'text-blue-400 dark:text-slate-500 group-hover:text-blue-200'} transition-colors`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </button>
);

export default App;
