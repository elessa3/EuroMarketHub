import { EuroExpense } from "../types";
import { JobOpportunity } from '../types'; 

export const mockExpenses: EuroExpense[] = [
  {
    id: "1",
    title: "Taxa do Visto D7",
    valueInEuro: 90,
    category: "Visto",
    isPaid: true,
  },
  {
    id: "2",
    title: "Passagem de Ida",
    valueInEuro: 650,
    category: "Passagem",
    isPaid: false,
  },  
];


export const mockJobs: JobOpportunity[] = [
  {
    id: '1',
    role: 'Frontend Developer (React)',
    company: 'TechBerlin GmbH',
    country: 'Alemanha',
    salaryRange: '€45k - €55k / ano',
    status: 'Entrevista'
  },
  {
    id: '2',
    role: 'Mobile Engineer (React Native)',
    company: 'Dublin FinTech',
    country: 'Irlanda',
    salaryRange: '€50k - €65k / ano',
    status: 'Aplicado'
  },
  {
    id: '3',
    role: 'Fullstack Developer',
    company: 'Lisbon Startup',
    country: 'Portugal',
    status: 'Oferta' 
  }
];
