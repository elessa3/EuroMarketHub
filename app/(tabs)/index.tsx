import { useState, useMemo } from 'react'; // 1. Importamos o useMemo aqui
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'; 
import { mockExpenses } from '../../src/constants/mockData'; 
import { EuroExpense } from '../../src/types'; 

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<EuroExpense[]>(mockExpenses);

  // 2. A Mágica do useMemo acontece aqui:
  const totalBudget = useMemo(() => {
    console.log('🔄 Calculando o total em Euro...'); // Esse log serve para você ver a performance no console!
    
    // Usamos o método .reduce do JavaScript para somar os valores da lista
    return expenses.reduce((accumulator, currentExpense) => {
      return accumulator + currentExpense.valueInEuro;
    }, 0);

  }, [expenses]); // <-- ARRAY DE DEPENDÊNCIAS: O cálculo só refaz se a lista 'expenses' mudar!

  const toggleExpenseStatus = (id: string) => {
    const updatedExpenses = expenses.map(expense => {
      if (expense.id === id) {
        return { ...expense, isPaid: !expense.isPaid };
      }
      return expense;
    });
    setExpenses(updatedExpenses);
  };

  const renderExpenseItem = ({ item }: { item: EuroExpense }) => (
    <TouchableOpacity style={styles.card} onPress={() => toggleExpenseStatus(item.id)}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.categoryTag}>{item.category}</Text>
      </View>
      <Text style={styles.price}>€ {item.valueInEuro.toFixed(2)}</Text>
      <Text style={[styles.status, item.isPaid ? styles.paid : styles.pending]}>
        {item.isPaid ? 'Pago ✅' : 'Pendente ⏳'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>EuroMarket Hub 🇪🇺</Text>
      <Text style={styles.subtitle}>Planejamento de Custos</Text>

      {/* 3. Exibindo o valor total calculado pelo useMemo na tela */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Custo Total Estimado:</Text>
        <Text style={styles.totalValue}>€ {totalBudget.toFixed(2)}</Text>
      </View>

      <FlatList
        data={expenses} 
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Sombra para o Android físico
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  categoryTag: {
    fontSize: 12,
    backgroundColor: "#e3f2fd",
    color: "#0d47a1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  paid: {
    color: "#2e7d32",
  },
  pending: {
    color: "#c62828",
  },
  // Adicione estes blocos dentro do seu StyleSheet
  totalContainer: {
    backgroundColor: '#1a237e', // Um azul escuro bem elegante
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalLabel: {
    color: '#bbdefb',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  totalValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
