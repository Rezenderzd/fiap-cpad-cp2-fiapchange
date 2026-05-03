import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../provider.js';


export default function UserCard({ onLogout }) {
  const { usuarioLogado, isDarkMode } = useContext(AppContext);

  if (!usuarioLogado) return null;

  return (
    <View style={[styles.card, { backgroundColor: isDarkMode ? '#111' : '#f0f0f0' }]}>
      <View style={styles.info}>
        <Text style={styles.nome}>{usuarioLogado.nomeCompleto}</Text>
        <Text style={styles.sala}>
          Sala atual:{' '}
          <Text style={styles.salaNegrito}>{usuarioLogado.sala.toUpperCase()}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.botaoSair} onPress={onLogout}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 300, borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: '#ED145B' },
  info:         { gap: 3 },
  nome:         { color: '#ED145B', fontSize: 16, fontWeight: '800' },
  sala:         { color: '#ED145B', fontSize: 13, opacity: 0.8 },
  salaNegrito:  { fontWeight: '800', opacity: 1 },
  botaoSair:    { backgroundColor: '#ED145B22', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  botaoSairTexto: { color: '#ED145B', fontSize: 13, fontWeight: '700' },
});