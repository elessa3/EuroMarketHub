import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react"; // 1. Importamos o useMemo aqui
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mockExpenses } from "../../src/constants/mockData";
import { CurrencyRate, EuroExpense } from "../../src/types";

export default function HomeScreen() {
  const STORAGE_KEY = "@euromarket_expenses";
  const router = useRouter();
  const params = useLocalSearchParams<{ newExpenseData?: string }>(); // Captura os parâmetros recebidos

  const [expenses, setExpenses] = useState<EuroExpense[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<CurrencyRate | null>(null);
  const [loadingRate, setLoadingRate] = useState<boolean>(true);

  // 2. A MÁGICA DO useEffect ACONTECE AQUI:
  useEffect(() => {
    if (params.newExpenseData) {
      try {
        const parsedExpense: EuroExpense = JSON.parse(params.newExpenseData);
        // Adiciona a nova despesa no início da lista para o usuário ver logo de cara!
        setExpenses((prevExpenses) => {
          // Evita duplicar se o efeito rodar mais de uma vez
          const exists = prevExpenses.some(
            (item) => item.id === parsedExpense.id,
          );
          if (exists) return prevExpenses;
          return [parsedExpense, ...prevExpenses];
        });
      } catch (e) {
        console.error("Erro ao processar nova despesa:", e);
      }
    }
  }, [params.newExpenseData]);

  // 2. useEffect para buscar a cotação do Euro na API
  useEffect(() => {
    async function fetchEuroRate() {
      try {
        setLoadingRate(true);

        // Usando a API oficial do Frankfurter (União Europeia) para EUR -> BRL
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=EUR&to=BRL",
        );

        if (response.status === 429) {
          console.warn(
            "⚠️ Limite de requisições atingido (429). Usando valor de fallback.",
          );
          // Define um valor aproximado de fallback caso ocorra o erro 429
          setExchangeRate({
            code: "EUR",
            codein: "BRL",
            name: "Euro/Real Brasileiro",
            bid: "6.10",
            pctChange: "0",
            create_date: new Date().toISOString(),
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data da API do Frankfurter:", data);

        if (data && data.rates && data.rates.BRL) {
          setExchangeRate({
            code: "EUR",
            codein: "BRL",
            name: "Euro/Real",
            bid: data.rates.BRL.toString(),
            pctChange: "0",
            create_date: data.date,
          });
        }
      } catch (error) {
        console.error(
          "Erro ao buscar a cotação do Euro, aplicando fallback:",
          error,
        );
        // Fallback em caso de erro de rede ou qualquer falha
        setExchangeRate({
          code: "EUR",
          codein: "BRL",
          name: "Euro/Real (Offline)",
          bid: "6.10",
          pctChange: "0",
          create_date: new Date().toISOString(),
        });
      } finally {
        setLoadingRate(false);
      }
    }

    fetchEuroRate();
  }, []);

  // Efeito 1: Carrega os dados salvos no AsyncStorage quando a tela abre
  useEffect(() => {
    async function loadSavedExpenses() {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData !== null) {
          // Se encontrou dados salvos, converte de String JSON para Array de objetos
          setExpenses(JSON.parse(savedData));
        } else {
          // Se é a PRIMEIRA VEZ que o app abre, usa os dados do mock
          setExpenses(mockExpenses);
        }
      } catch (error) {
        console.error("Erro ao carregar despesas do armazenamento:", error);
        setExpenses(mockExpenses);
      } finally {
        setIsStorageLoaded(true); // Marca que o carregamento inicial terminou
      }
    }

    loadSavedExpenses();
  }, []);

  // Efeito 2: Salva no AsyncStorage sempre que o estado 'expenses' for alterado
  useEffect(() => {
    async function saveExpenses() {
      if (!isStorageLoaded) return; // Não salva enquanto não tiver feito o primeiro carregamento!

      try {
        const jsonValue = JSON.stringify(expenses);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("💾 Despesas salvas no AsyncStorage com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar despesas:", error);
      }
    }

    saveExpenses();
  }, [expenses, isStorageLoaded]);

  // 2. A Mágica do useMemo acontece aqui:
  const totalBudget = useMemo(() => {
    console.log("🔄 Calculando o total em Euro..."); // Esse log serve para você ver a performance no console!

    // Usamos o método .reduce do JavaScript para somar os valores da lista
    return expenses.reduce((accumulator, currentExpense) => {
      return accumulator + currentExpense.valueInEuro;
    }, 0);
  }, [expenses]); // <-- ARRAY DE DEPENDÊNCIAS: O cálculo só refaz se a lista 'expenses' mudar!

  const toggleExpenseStatus = (id: string) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === id) {
        return { ...expense, isPaid: !expense.isPaid };
      }
      return expense;
    });
    setExpenses(updatedExpenses);
  };

  const renderExpenseItem = ({ item }: { item: EuroExpense }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleExpenseStatus(item.id)}
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

      {/* CARD DE COTAÇÃO DO EURO EM TEMPO REAL */}
      <View style={styles.rateCard}>
        {loadingRate ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : exchangeRate ? (
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Cotação Hoje (EUR ➔ BRL):</Text>
            <Text style={styles.rateValue}>
              R$ {parseFloat(exchangeRate.bid).toFixed(2)}
            </Text>
          </View>
        ) : (
          <Text style={styles.rateError}>
            Não foi possível carregar o Euro hoje ⚠️
          </Text>
        )}
      </View>

      {/* CARD DO TOTAL DE CUSTOS EM EURO */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Custo Total Estimado:</Text>
        <Text style={styles.totalValue}>€ {totalBudget.toFixed(2)}</Text>

        {/* Mostra o total convertido em Reais se a cotação já tiver carregado */}
        {exchangeRate && (
          <Text style={styles.totalConverted}>
            ≈ R${" "}
            {(totalBudget * parseFloat(exchangeRate.bid)).toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )}
          </Text>
        )}
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* BOTÃO PARA ABRIR O FORMULÁRIO */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/modal")}
      >
        <Text style={styles.addButtonText}>+ Nova Despesa</Text>
      </TouchableOpacity>
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
    backgroundColor: "#1a237e", // Um azul escuro bem elegante
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalLabel: {
    color: "#bbdefb",
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  totalValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },

  rateCard: {
    backgroundColor: "#0d47a1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: {
    color: "#bbdefb",
    fontSize: 13,
    fontWeight: "500",
  },
  rateValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rateError: {
    color: "#ffcdd2",
    fontSize: 12,
  },
  totalConverted: {
    color: "#81c784",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
