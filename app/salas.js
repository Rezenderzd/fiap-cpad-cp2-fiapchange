import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from './provider.js';

export default function Sobre() {
  const router = useRouter();
  const { salas, totalAlunosGlobal, isDarkMode, adicionarVaga, removerVaga } = useContext(AppContext);

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
      <Text style={styles.titulo}>Salas Disponíveis</Text>
      <ScrollView contentContainerStyle={styles.listaSalas}>
        {salas.map((item, index) => (
        <View key={index} style={[styles.cardSala, {backgroundColor: isDarkMode? "#1A1A1A": "#bbb"}]}>
          <View>
            <Text style={styles.salaTexto}>Sala: {item.sala}</Text>
            <Text style={styles.vagasTexto}>Vagas: {item.vagas}</Text>
          </View>

          {/* NOVOS BOTÕES DE INTERAÇÃO */}
          <View style={styles.botoesContainer}>
            <TouchableOpacity 
              style={styles.botaoAcao} 
              onPress={() => adicionarVaga(item.sala)}
            >
              <Text style={styles.textoBotao}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoAcao} 
              onPress={() => removerVaga(item.sala)}
            >
              <Text style={styles.textoBotao}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
        {/* CONTADOR GLOBAL: Aparece embaixo da última sala */}
        <View style={styles.cardTotal}>
          <Text style={styles.totalLabel}>Total de aluno no 2º ano de Ciências da computação</Text>
          <Text style={styles.totalNumero}>{totalAlunosGlobal}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/')}>
        <Text style={styles.voltarTexto}>Ir para o formulário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 60 
  },
  switch:{ 
    position: 'absolute', 
    top: 40, 
    right: 20
  },
  titulo: { 
    fontSize: 25, 
    marginBottom: 20, 
    color: '#ED145B' 
  },
  listaSalas: { 
    alignItems: 'center', 
    gap: 15,
    paddingBottom: 20
  },
  cardSala: {
    width: 320,
    borderLeftWidth: 5,
    borderLeftColor: '#ED145B', 
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  salaTexto: { 
    color: '#ED145B', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  vagasTexto: { 
    color: '#ED145B', 
    fontSize: 16 
  },
  botaoVoltar: {
    marginVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ED145B'
  },
  voltarTexto: { 
    fontSize: 16, 
    color: '#ED145B', 
    fontWeight: '600' 
  },
  cardTotal: {
    width: 320,
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    color: '#ED145B',
    fontSize: 16,
    textTransform: 'captlize',
    textAlign: 'center',  
  },
  totalNumero: {
    color: '#ED145B',
    fontSize: 30,
    fontWeight: 'bold'
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoAcao: {
    backgroundColor: '#ED145B',
    width: 20,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  });