// Contrato para os custos de mudança
export interface EuroExpense {
  id: string;
  title: string;
  valueInEuro: number;
  category:
    | "Visto"
    | "Passagem"
    | "Acomodação"
    | "Reserva"
    | "Alimentação"
    | "Emergência"
    | "Transporte"
    | "Outros";
  isPaid: boolean;
}

// Contrato para as vagas de emprego na Europa que você vai monitorar
export interface JobOpportunity {
  id: string;
  role: string;
  company: string;
  country: "Portugal" | "Alemanha" | "Irlanda" | "Holanda" | "Remoto";
  salaryRange?: string; // A interrogação significa que o salário é opcional (na Europa nem sempre divulgam)
  status: "Aplicado" | "Entrevista" | "Recusado" | "Oferta" | "In progress";
}
