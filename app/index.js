import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Modal, ScrollView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { AppContext } from './provider.js';

export default function Home() {
  const router = useRouter();
  const { historico, isDarkMode, toggleSwitchDarkMode, usuarioLogado } = useContext(AppContext);
  const [modalVisivel, setModalVisivel] = useState(false);

  const primeiroNome = usuarioLogado?.nomeCompleto.split(' ')[0] ?? '';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Switch
        value={isDarkMode}
        onValueChange={toggleSwitchDarkMode}
        style={styles.switch}
      />

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

      <TouchableOpacity
        style={styles.botaoHistorico}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={styles.botaoHistoricoTexto}>VISUALIZAR HISTÓRICO</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Histórico de Trocas</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {historico.length === 0 ? (
                <Text style={styles.vazio}>Nenhum registro encontrado.</Text>
              ) : (
                historico.map((item) => (
                  <View key={item.id} style={styles.itemLog}>
                    <Text style={styles.textoLog}>{item.texto}</Text>
                    <Text style={styles.horaLog}>{item.data}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.fecharTexto}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, alignItems: 'center', justifyContent: 'center' },
  switch:              { position: 'absolute', top: 40, right: 20 },
  imagem:              { width: 180, height: 180, marginBottom: 14 },
  saudacao:            { fontSize: 18, color: '#ED145B', marginBottom: 4, fontWeight: '600' },
  titulo:              { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#ED145B', textAlign: 'center' },
  subtitulo:           { fontSize: 16, color: '#ED145B', marginBottom: 6, textAlign: 'center' },
  curso:               { fontSize: 14, color: '#ED145B', marginBottom: 36, opacity: 0.7, textAlign: 'center' },
  botao:               { backgroundColor: '#ED145B', padding: 16, borderRadius: 12, marginBottom: 12 },
  botaoTexto:          { color: '#fff', fontSize: 16, fontWeight: '600' },
  botaoHistorico:      { position: 'absolute', bottom: 30, paddingVertical: 12, backgroundColor: '#ED145B', paddingHorizontal: 20, borderRadius: 8 },
  botaoHistoricoTexto: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  modalOverlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent:        { width: '85%', height: '70%', backgroundColor: '#000', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#ED145B' },
  modalTitulo:         { color: '#ED145B', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  itemLog:             { borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 12 },
  textoLog:            { color: '#FFF', fontSize: 14 },
  horaLog:             { color: '#aaa', fontSize: 11, marginTop: 4, textAlign: 'right' },
  vazio:               { color: '#FFF', textAlign: 'center', marginTop: 50 },
  botaoFechar:         { marginTop: 20, backgroundColor: '#ED145B', padding: 14, borderRadius: 10, alignItems: 'center' },
  fecharTexto:         { color: '#fff', fontWeight: 'bold' },
});