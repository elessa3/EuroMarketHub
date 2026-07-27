import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddExpenseModal() {
  const router = useRouter();

  // Estados para controlar os campos do formulário
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');

  const handleSaveExpense = () => {
    // 1. Validação simples de campos obrigatórios
    if (!title.trim() || !value.trim() || !category.trim()) {
      Alert.alert('Campos Incompletos ⚠️', 'Por favor, preencha todos os campos do formulário.');
      return;
    }

    const numericValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Valor Inválido ⚠️', 'Digite um valor numérico válido para a despesa.');
      return;
    }

    // Criamos o novo objeto da despesa
    const newExpense = {
      id: Date.now().toString(), // Gera um ID único baseado no timestamp
      title: title.trim(),
      valueInEuro: numericValue,
      category: category.trim(),
      isPaid: false,
    };

    // 3. Navega de volta para a tela principal passando o novo item como parâmetro em formato JSON
    router.dismissTo({
      pathname: '/(tabs)',
      params: { newExpenseData: JSON.stringify(newExpense) },
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.modalTitle}>Adicionar Nova Despesa 💶</Text>
        <Text style={styles.modalSubtitle}>Insira os detalhes do novo custo de mudança</Text>

        {/* CAMPO 1: TÍTULO */}
        <Text style={styles.label}>Título da Despesa</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Seguro Viagem, Alguel Inicial..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        {/* CAMPO 2: VALOR EM EURO */}
        <Text style={styles.label}>Valor em Euro (€)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 150.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={setValue}
        />

        {/* CAMPO 3: CATEGORIA */}
        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Moradia, Documentação, Transporte"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />

        {/* BOTÃO DE SALVAR */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
          <Text style={styles.saveButtonText}>Cadastrar Despesa</Text>
        </TouchableOpacity>

        {/* BOTÃO DE CANCELAR */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f4f6f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '600',
  },
});