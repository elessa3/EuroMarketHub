import { EuroExpense } from "../types";

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
    category: "Passagem", // <--- ATENÇÃO AQUI!
    isPaid: false,
  },
];
