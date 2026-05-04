import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Modal,
  FlatList, KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useState, useContext, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { AppContext } from './provider.js';
import InputField from './components/InputField.js';
import PrimaryButton from './components/PrimaryButton.js';
import UserCard from './components/UserCard.js';

export default function Formulario() {
  const router = useRouter();
  const {
    salas, removerVaga, adicionarVaga, adicionarAoHistorico,
    isDarkMode, usuarioLogado, logout, atualizarSalaUsuario,
  } = useContext(AppContext);

  const [motivo, setMotivo] = useState('');
  const [salaDestino, setSalaDestino] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagemGlobal, setMensagemGlobal] = useState({ texto: '', tipo: '' });

  const salaAtualObj = salas.find(
    (s) => s.sala.toUpperCase() === (usuarioLogado?.sala ?? '').toUpperCase()
  ) ?? null;

  const limparFormulario = () => {
    setMotivo('');
    setSalaDestino(null);
    setErros({});
    setMensagemGlobal({ texto: '', tipo: '' });
  };

  useFocusEffect(
    useCallback(() => {
      return () => limparFormulario();
    }, [])
  );

  const validar = () => {
    const e = {};
    if (!salaDestino) e.salaDestino = 'Selecione a sala de destino.';
    if (!motivo.trim()) e.motivo = 'Informe o motivo da troca.';
    if (salaAtualObj && salaDestino?.sala === salaAtualObj.sala)
      e.salaDestino = 'Destino deve ser diferente da sala atual.';
    if (salaDestino && salaDestino.vagas <= 0)
      e.salaDestino = 'A sala de destino não possui vagas.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const processarTroca = () => {
    setMensagemGlobal({ texto: '', tipo: '' });
    const chance = Math.random();
    
    if (chance > 0.7) {
      const motivosFalha = [
        'Seu motivo não foi aceito pela coordenação.',
        'Limite de solicitações diárias atingido.',
        'Desempenho acadêmico insuficiente para esta sala.',
        'Sistema de validação offline no momento.',
      ];
      setMensagemGlobal({ 
        texto: motivosFalha[Math.floor(Math.random() * motivosFalha.length)], 
        tipo: 'erro' 
      });
      return;
    }

    const nomeLogado = usuarioLogado.nomeCompleto;
    adicionarAoHistorico(nomeLogado, salaAtualObj.sala, salaDestino.sala);
    adicionarVaga(salaAtualObj.sala);
    removerVaga(salaDestino.sala);
    atualizarSalaUsuario(salaDestino.sala);
    setMensagemGlobal({ 
      texto: `Sucesso! Você foi transferido para ${salaDestino.sala.toUpperCase()}. ✅`, 
      tipo: 'sucesso' 
    });
    setMotivo('');
    setSalaDestino(null);
  };

  const enviarDados = () => {
    if (!validar()) return;
    Alert.alert(
      'Confirmar Solicitação',
      `Deseja realmente trocar para a sala ${salaDestino.sala.toUpperCase()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: processarTroca },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const bg = isDarkMode ? '#000' : '#fff';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: bg, flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Formulario para mudança</Text>

          <View style={styles.userCardWrapper}>
            <UserCard onLogout={handleLogout} />
          </View>

          <View style={styles.form}>
            <View style={styles.campoSala}>
              <Text style={styles.label}>Sala Destino</Text>
              <TouchableOpacity
                style={[
                  styles.seletorRow, 
                  { backgroundColor: isDarkMode ? '#1A1A1A' : '#F3F4F6' },
                  erros.salaDestino && styles.seletorErro
                ]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}>
                <Text style={[styles.seletorTexto, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {salaDestino ? salaDestino.sala.toUpperCase() : 'Selecione uma sala...'}
                </Text>
                <Text style={{ color: '#ED145B' }}>▼</Text>
              </TouchableOpacity>
              {erros.salaDestino ? <Text style={styles.erroTexto}>{erros.salaDestino}</Text> : null}
            </View>

            <InputField
              label="Motivo da Troca"
              icon="📝"
              value={motivo}
              onChangeText={(t) => { 
                setMotivo(t); 
                setErros((e) => ({ ...e, motivo: '' })); 
                setMensagemGlobal({ texto: '', tipo: '' });
              }}
              placeholder="Descreva o motivo"
              erro={erros.motivo}
            />

            <View style={styles.botoes}>
              <PrimaryButton label="Limpar" onPress={limparFormulario} color="#6B7280" />
              <PrimaryButton label="Solicitar Troca" onPress={enviarDados} color="#ED145B" />
            </View>

            {mensagemGlobal.texto ? (
              <View style={[
                styles.statusBanner, 
                { backgroundColor: mensagemGlobal.tipo === 'erro' ? '#FEE2E2' : '#DCFCE7' }
              ]}>
                <Text style={[
                  styles.statusTexto, 
                  { color: mensagemGlobal.tipo === 'erro' ? '#B91C1C' : '#15803D' }
                ]}>
                  {mensagemGlobal.texto}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.linkSalas} onPress={() => router.push('/salas')}>
              <Text style={styles.linkSalasTexto}>Explorar salas disponíveis →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalConteudo, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
            <View style={styles.modalHeaderBar} />
            <Text style={styles.modalTitulo}>Salas para Transferência</Text>
            <FlatList
              data={salas.filter(
                (s) => s.sala.toUpperCase() !== (usuarioLogado?.sala ?? '').toUpperCase()
              )}
              keyExtractor={(item) => item.sala}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemSala,
                    salaDestino?.sala === item.sala && styles.itemSalaAtivo,
                  ]}
                  onPress={() => {
                    setSalaDestino(item);
                    setErros((e) => ({ ...e, salaDestino: '' }));
                    setModalVisible(false);
                  }}
                >
                  <View>
                    <Text style={styles.itemTexto}>{item.sala.toUpperCase()}</Text>
                    <Text style={styles.itemCapacidade}>Capacidade: {item.capacidade}</Text>
                  </View>
                  <View style={styles.itemVagasBadge}>
                    <Text style={styles.itemVagasTexto}>{item.vagas} vagas</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.modalBotaoFechar} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBotaoFecharTexto}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  titulo: { fontSize: 20, color: '#ED145B', marginBottom: 20},
  userCardWrapper: { marginBottom: 20 },
  form: { width: 320 },
  statusBanner: { padding: 14, borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  statusTexto: { textAlign: 'center', fontWeight: 'bold', fontSize: 14 },
  label: { color: '#ED145B', fontSize: 12, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase' },
  campoSala: { marginBottom: 20 },
  seletorRow: { 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ED145B44' 
  },
  seletorErro: { borderColor: '#ED145B', borderWidth: 2 },
  seletorTexto: { fontSize: 15, fontWeight: '500' },
  erroTexto: { color: '#ED145B', fontSize: 12, marginTop: 6, fontWeight: '600' },
  botoes: { flexDirection: 'row', gap: 80, marginTop: 10 },
  linkSalas: { marginTop: 30, alignItems: 'center' },
  linkSalasTexto: { color: '#ED145B', fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalConteudo: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '60%' },
  modalHeaderBar: { width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  modalTitulo: { color: '#ED145B', fontSize: 22, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  itemSala: { 
    paddingVertical: 18, 
    paddingHorizontal: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  itemSalaAtivo: { backgroundColor: '#ED145B10', borderRadius: 15 },
  itemTexto: { color: '#ED145B', fontSize: 18, fontWeight: 'bold' },
  itemCapacidade: { color: '#888', fontSize: 12 },
  itemVagasBadge: { backgroundColor: '#ED145B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  itemVagasTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalBotaoFechar: { marginTop: 15, padding: 15, alignItems: 'center' },
  modalBotaoFecharTexto: { color: '#666', fontWeight: 'bold', letterSpacing: 1 },
});