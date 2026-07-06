import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { mockJobs } from '../src/constants/mockData';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID que passamos pela navegação
  const router = useRouter();

  // Busca a vaga correspondente ao ID recebido
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vaga não encontrada! 😢</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão de Voltar personalizado */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>⬅ Voltar</Text>
      </TouchableOpacity>

      <View style={styles.detailsCard}>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.role}>{job.role}</Text>
        <Text style={styles.country}>📍 Localização: {job.country}</Text>
        
        {job.salaryRange && (
          <Text style={styles.salary}>💰 Salário: {job.salaryRange}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Requisitos Europeus (Simulação):</Text>
        <Text style={styles.bullet}>• Inglês Avançado / Fluente (Obrigatório)</Text>
        <Text style={styles.bullet}>• Experiência sólida com a Tech Stack</Text>
        <Text style={styles.bullet}>• Portfólio bem estruturado no GitHub</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
  
  },
  backButtonText: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  company: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
    marginBottom: 12,
  },
  country: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 40,
  },
});