
export enum Month {
  JAN = 'Januari',
  FEB = 'Februari',
  MAR = 'Maret',
  APR = 'April',
  MAY = 'Mei',
  JUN = 'Juni',
  JUL = 'Juli',
  AUG = 'Agustus',
  SEP = 'September',
  OCT = 'Oktober',
  NOV = 'November',
  DEC = 'Desember'
}

export type UserRole = 'ADMIN' | 'GUEST';

export type Divisi = 
  | "Kahim/Wakahim" 
  | "Secretariat Administration" 
  | "Financial Administration" 
  | "Organizing Refreshment" 
  | "Social Affairs" 
  | "Domestic Affairs" 
  | "Foreign Affairs" 
  | "Media and Information" 
  | "Research and Development" 
  | "Human Research Development" 
  | "Creative Economy";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  photoUrl?: string;
  programKerja?: string;
  divisi?: string;
}

export interface PaguEntry {
  id: string;
  nominal: number;
  divisi: string;
  photoUrl: string;
  description: string;
  month: Month;
  createdAt: string;
}

export interface MemberKas {
  id: string;
  name: string;
  payments: { [key in Month]?: boolean };
  lateStatus: { [key in Month]?: boolean };
}

export interface DivisiKasContainer {
  [divisiName: string]: MemberKas[];
}

export interface FormSubmission {
  id: string;
  name: string;
  divisi: Divisi[];
  months: Month[];
  evidenceUrl: string;
  submittedAt: string;
}

export interface MonthlyData {
  month: Month;
  transactions: Transaction[];
}

export interface NonCashEvidence {
  id: string;
  title: string;
  imageUrl: string;
  month: Month;
  uploadedAt: string;
}
