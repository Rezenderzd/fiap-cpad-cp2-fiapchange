import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from './provider.js';
 
export default function Home() {
  const router = useRouter();
  const { isDarkMode, usuarioLogado } = useContext(AppContext);
 
  const primeiroNome = usuarioLogado?.nomeCompleto.split(' ')[0] ?? '';
 
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Image
        source={{ uri: 'https://www.100security.com.br/images/e-u-br-fiap.png' }}
        style={styles.imagem}
      />
 
      <Text style={styles.saudacao}>Olá, {primeiroNome}! 👋</Text>
      <Text style={styles.titulo}>Bem-vindo ao FiapChange!</Text>
      <Text style={styles.subtitulo}>O melhor app para mudar de sala</Text>
      <Text style={styles.curso}>Ciências da Computação — 2º ano</Text>
 
      <TouchableOpacity style={styles.botao} onPress={() => router.push('/formulario')}>
        <Text style={styles.botaoTexto}>Solicitar Mudança de Sala</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  switch:     { position: 'absolute', top: 40, right: 20 },
  imagem:     { width: 180, height: 180, marginBottom: 14 },
  saudacao:   { fontSize: 18, color: '#ED145B', marginBottom: 4, fontWeight: '600' },
  titulo:     { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#ED145B', textAlign: 'center' },
  subtitulo:  { fontSize: 16, color: '#ED145B', marginBottom: 6, textAlign: 'center' },
  curso:      { fontSize: 14, color: '#ED145B', marginBottom: 36, opacity: 0.7, textAlign: 'center' },
  botao:      { backgroundColor: '#ED145B', padding: 16, borderRadius: 12, marginBottom: 12 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});