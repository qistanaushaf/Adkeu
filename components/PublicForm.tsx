
import React from 'react';
import { Wallet, ExternalLink, ShieldCheck, ArrowRight, ClipboardCheck } from 'lucide-react';
// Added imports for types to support onSubmit prop
import { FormSubmission, Month } from '../types';

// Fixed: Defined PublicFormProps interface to include onSubmit as expected by App.tsx
interface PublicFormProps {
  onSubmit: (submission: FormSubmission) => void;
}

const PublicForm: React.FC<PublicFormProps> = ({ onSubmit }) => {
  const googleFormLink = "https://forms.gle/ofB7TbZN86cwKhKa8";

  // Fixed: Added handleAction to trigger the onSubmit callback with mock data for demo purposes
  const handleAction = () => {
    window.open(googleFormLink, '_blank');
    
    // Simulate a successful form submission returning to our internal database
    onSubmit({
      id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: "Anggota HIMAHI (Demo)",
      divisi: ["Media and Information"],
      months: [Month.JAN, Month.FEB],
      evidenceUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans selection:bg-blue-100 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-yellow-300 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-blue-900/10 border border-slate-100 text-center">
          <header className="mb-12">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/30 rotate-3 mb-8">
              <Wallet className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Portal Pembayaran <br/>Kas HIMAHI UB 2026
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Official Financial Documentation Portal</p>
          </header>

          <div className="space-y-8">
            <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-center gap-4 text-left mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Sistem Terintegrasi</h3>
                  <p className="text-xs text-slate-500">Formulir resmi ini terhubung langsung dengan database keuangan organisasi.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Validasi Otomatis</h3>
                  <p className="text-xs text-slate-500">Mohon pastikan bukti transfer terlihat jelas untuk mempercepat proses verifikasi.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAction}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-lg tracking-widest uppercase shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              Isi Form Pembayaran
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Layanan Keuangan & Dokumentasi <br/> HIMAHI UB Periode 2026
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-slate-300 font-medium text-xs">
            Kesulitan mengisi? Hubungi <span className="text-blue-400 font-bold cursor-pointer hover:underline">Financial Administration</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PublicForm;
