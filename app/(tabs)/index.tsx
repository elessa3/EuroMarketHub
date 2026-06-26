import { useState } from "react"; // <-- IMPORTANTE: Importando o gerenciador de estado
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"; // Adicionado TouchableOpacity
import { mockExpenses } from "../../src/constants/mockData";
import { EuroExpense } from "../../src/types";

export default function HomeScreen() {
  // Criando um estado que começa com os nossos dados fakes
  const [expenses, setExpenses] = useState<EuroExpense[]>(mockExpenses);

  // Função que vai ser disparada quando você clicar no cartão
  const toggleExpenseStatus = (id: string) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === id) {
        // Inverte o status de isPaid (se era true vira false, se era false vira true)
        return { ...expense, isPaid: !expense.isPaid };
      }
      return expense;
    });

    // Atualiza a tela com os novos dados
    setExpenses(updatedExpenses);
  };

  const renderExpenseItem = ({ item }: { item: EuroExpense }) => (
    // Transformamos o View antigo em um TouchableOpacity para poder clicar
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleExpenseStatus(item.id)} // Dispara a função ao clicar
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.categoryTag}>{item.category}</Text>
      </View>
      <Text style={styles.price}>€ {item.valueInEuro.toFixed(2)}</Text>
      <Text style={[styles.status, item.isPaid ? styles.paid : styles.pending]}>
        {item.isPaid ? "Pago ✅" : "Pendente ⏳"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>EuroMarket Hub 🇪🇺</Text>
      <Text style={styles.subtitle}>Planejamento de Custos</Text>

      <FlatList
        data={expenses} // <-- IMPORTANTE: Agora usamos o estado, não os dados fixos
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
});
