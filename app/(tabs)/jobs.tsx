import { useRouter } from "expo-router"; // <-- IMPORTANTE: Importar o roteador
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"; // Adicionado TouchableOpacity
import { mockJobs } from "../../src/constants/mockData";
import { JobOpportunity } from "../../src/types";

export default function JobsScreen() {
  const router = useRouter(); // Inicializa o roteador

  const renderJobItem = ({ item }: { item: JobOpportunity }) => (
    // Transformamos o View em TouchableOpacity e adicionamos o onPress
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${item.id}`)} // Navega para /1, /2, etc.
    >
      <Text style={styles.role}>{item.role}</Text>
      <Text style={styles.company}>{item.company} 🏢</Text>

      <View style={styles.infoRow}>
        <Text style={styles.countryTag}>📍 {item.country}</Text>
        {item.salaryRange && (
          <Text style={styles.salary}>{item.salaryRange}</Text>
        )}
      </View>

      <Text
        style={[
          styles.status,
          styles[item.status.toLowerCase() as keyof typeof styles],
        ]}
      >
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Vagas de Emprego 🇪🇺</Text>
      <Text style={styles.subtitle}>Acompanhe suas candidaturas na Europa</Text>

      <FlatList
        data={mockJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
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
    borderLeftWidth: 5,
    borderLeftColor: "#2196f3", // Borda azul lateral estilosa
  },
  role: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  company: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  countryTag: {
    fontSize: 12,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: "#444",
  },
  salary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2e7d32",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  aplicado: { color: "#f57c00" },
  entrevista: { color: "#2196f3" },
  recusado: { color: "#d32f2f" },
  oferta: { color: "#388e3c" },
});
