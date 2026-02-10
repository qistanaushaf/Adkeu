
import React, { useMemo, useState } from 'react';
import { MonthlyData, PaguEntry, Month } from '../types';
import { TrendingUp, FileText, ArrowUpRight, ArrowDownRight, Landmark, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MONTHS } from '../constants';

interface DashboardProps {
  financeData: MonthlyData[];
  paguData: PaguEntry[];
  totalPaguBudget: number;
}

const Dashboard: React.FC<DashboardProps> = ({ financeData, paguData, totalPaguBudget }) => {
  const [selectedMonth, setSelectedMonth] = useState<Month>(MONTHS[new Date().getMonth()]);

  const stats = useMemo(() => {
    let totalHibahIncome = 0;
    let totalHibahExpense = 0;
    
    financeData.forEach(m => {
      m.transactions.forEach(t => {
        if (t.type === 'INCOME') totalHibahIncome += t.amount;
        else totalHibahExpense += t.amount;
      });
    });

    const currentMonthData = financeData.find(m => m.month === selectedMonth);
    const monthlyIncome = currentMonthData?.transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0) || 0;
    const monthlyExpense = currentMonthData?.transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0) || 0;

    const totalPaguSpent = paguData.reduce((acc, p) => acc + p.nominal, 0);

    return {
      hibahBalance: totalHibahIncome - totalHibahExpense,
      monthlyIncome,
      monthlyExpense,
      paguRemaining: totalPaguBudget - totalPaguSpent
    };
  }, [financeData, paguData, totalPaguBudget, selectedMonth]);

  const chartData = financeData.map(m => ({
    name: m.month,
    income: m.transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0),
    expense: m.transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0),
  })).filter(d => d.income > 0 || d.expense > 0);

  const paguChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    paguData.forEach(p => {
      counts[p.divisi] = (counts[p.divisi] || 0) + p.nominal;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [paguData]);

  const COLORS = ['#1e3a8a', '#eab308', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f97316', '#06b6d4'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">Dashboard Keuangan</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Ikhtisar Pengelolaan Dana HIMAHI UB 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-slate-400" />
          <select 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value as Month)}
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Saldo Dana Hibah" 
          value={`Rp ${stats.hibahBalance.toLocaleString('id-ID')}`} 
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <StatCard 
          label={`Masuk (${selectedMonth})`} 
          value={`Rp ${stats.monthlyIncome.toLocaleString('id-ID')}`} 
          icon={<ArrowUpRight className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard 
          label={`Keluar (${selectedMonth})`} 
          value={`Rp ${stats.monthlyExpense.toLocaleString('id-ID')}`} 
          icon={<ArrowDownRight className="w-6 h-6" />}
          color="rose"
        />
        <StatCard 
          label="Saldo Dana Pagu" 
          value={`Rp ${stats.paguRemaining.toLocaleString('id-ID')}`} 
          icon={<Landmark className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">Performa Kas Bulanan</h3>
          <div className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: '#1e293b', color: '#fff'}}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={20} name="Pemasukan" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={20} name="Pengeluaran" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-[10px] uppercase font-bold tracking-widest">Belum ada data transaksi</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">Alokasi Pagu Per Divisi</h3>
          <div className="h-[350px]">
            {paguChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paguChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paguChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-[10px] uppercase font-bold tracking-widest">Belum ada data alokasi Pagu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'rose' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/50',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${colors[color]} border transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
