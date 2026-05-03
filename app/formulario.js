import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Modal,
  FlatList, Switch, KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from './provider.js';
import InputField from './components/InputField.js';
import PrimaryButton from './components/PrimaryButton.js';
import UserCard from './components/UserCard.js';

export default function Formulario() {
  const router = useRouter();
  const {
    salas, removerVaga, adicionarVaga, adicionarAoHistorico,
    isDarkMode, toggleSwitchDarkMode,
    usuarioLogado, logout, atualizarSalaUsuario,
  } = useContext(AppContext);

  const [motivo,       setMotivo]       = useState('');
  const [salaDestino,  setSalaDestino]  = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [erros,        setErros]        = useState({});

  // Sala atual sempre vem do perfil — nunca editável diretamente
  const salaAtualObj = salas.find(
    (s) => s.sala.toUpperCase() === (usuarioLogado?.sala ?? '').toUpperCase()
  ) ?? null;

  const limparFormulario = () => {
    setMotivo('');
    setSalaDestino(null);
    setErros({});
  };

  const validar = () => {
    const e = {};
    if (!salaDestino)   e.salaDestino = 'Selecione a sala de destino.';
    if (!motivo.trim()) e.motivo      = 'Informe o motivo da troca.';
    if (salaAtualObj && salaDestino?.sala === salaAtualObj.sala)
      e.salaDestino = 'Destino deve ser diferente da sala atual.';
    if (salaDestino && salaDestino.vagas <= 0)
      e.salaDestino = 'A sala de destino não possui vagas.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const processarTroca = () => {
    const chance = Math.random();
    const motivosFalha = [
      'Seu motivo não foi aceito.',
      'Existem muitos alunos com interesse nessa sala.',
      'Devido ao seu baixo desempenho acadêmico sua solicitação foi negada.',
      'Atualmente a mudança de sala está fora do ar.',
      'O coordenador do curso precisa validar esta troca manualmente.',
      'Aluno já possui uma solicitação pendente.',
    ];

    if (chance > 0.7) {
      Alert.alert('Solicitação Negada ❌', motivosFalha[Math.floor(Math.random() * motivosFalha.length)]);
      return;
    }

    const nomeLogado = usuarioLogado.nomeCompleto;
    adicionarAoHistorico(nomeLogado, salaAtualObj.sala, salaDestino.sala);
    adicionarVaga(salaAtualObj.sala);
    removerVaga(salaDestino.sala);
    atualizarSalaUsuario(salaDestino.sala);

    Alert.alert(
      'Transferência aprovada! ✅',
      `${nomeLogado} foi transferido(a) para ${salaDestino.sala.toUpperCase()}.\nMotivo: ${motivo}`
    );
    limparFormulario();
  };

  const enviarDados = () => {
    if (!validar()) return;
    Alert.alert(
      'Confirmar Solicitação',
      `Trocar de ${salaAtualObj?.sala.toUpperCase()} para ${salaDestino.sala.toUpperCase()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: processarTroca },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); } },
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
          <Switch value={isDarkMode} onValueChange={toggleSwitchDarkMode} style={styles.switch} />

          <View style={styles.userCardWrapper}>
            <UserCard onLogout={handleLogout} />
          </View>

          <View style={styles.form}>

            {/* Sala Atual — somente leitura, vem do perfil */}
            <InputField
              label="Sala Atual"
              icon="📍"
              value={salaAtualObj ? salaAtualObj.sala.toUpperCase() : '—'}
              editable={false}
              badgeTexto="seu perfil"
            />

            {/* Sala Destino — selecionável via modal */}
            <View style={styles.campoSala}>
              <Text style={styles.label}>Sala Destino</Text>
              <TouchableOpacity
                style={[styles.seletorRow, erros.salaDestino && styles.seletorErro]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.seletorTexto}>
                  {salaDestino ? salaDestino.sala.toUpperCase() : 'Selecionar sala...'}
                </Text>
              </TouchableOpacity>
              {erros.salaDestino ? <Text style={styles.erroTexto}>{erros.salaDestino}</Text> : null}
            </View>

            {/* Motivo */}
            <InputField
              label="Motivo da Troca"
              icon="📝"
              value={motivo}
              onChangeText={(t) => { setMotivo(t); setErros((e) => ({ ...e, motivo: '' })); }}
              placeholder="Explique o motivo"
              erro={erros.motivo}
            />

            <View style={styles.botoes}>
              <PrimaryButton label="Apagar" onPress={limparFormulario} color="#555" />
              <PrimaryButton label="Enviar" onPress={enviarDados}      color="#0ed145" />
            </View>

            <TouchableOpacity style={styles.linkSalas} onPress={() => router.push('/salas')}>
              <Text style={styles.linkSalasTexto}>Ver lista de salas →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal de seleção — filtra a sala atual do usuário */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalConteudo, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
            <Text style={styles.modalTitulo}>Escolha a Sala Destino</Text>
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
                  <Text style={styles.itemTexto}>{item.sala.toUpperCase()}</Text>
                  <Text style={styles.itemVagas}>{item.vagas} vagas</Text>
                </TouchableOpacity>
              )}
            />
            <PrimaryButton label="Fechar" onPress={() => setModalVisible(false)} fullWidth />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { alignItems: 'center', paddingTop: 20, paddingBottom: 40 },
  switch:         { position: 'absolute', top: 40, right: 20 },
  userCardWrapper:{ marginTop: 50, marginBottom: 20 },
  form:           { width: 300 },
  label:          { color: '#ED145B', fontSize: 13, fontWeight: '700', marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  campoSala:      { marginBottom: 16 },
  seletorRow:     { borderRadius: 8, padding: 14, backgroundColor: '#ED145B' },
  seletorErro:    { borderWidth: 2, borderColor: '#fff' },
  seletorTexto:   { color: '#fff', fontSize: 14 },
  erroTexto:      { color: '#ED145B', fontSize: 12, marginTop: 4 },
  botoes:         { flexDirection: 'row', gap: 12, marginTop: 4 },
  linkSalas:      { marginTop: 24, alignItems: 'center' },
  linkSalasTexto: { color: '#ED145B', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalConteudo:  { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '55%', borderTopWidth: 2, borderColor: '#ED145B' },
  modalTitulo:    { color: '#ED145B', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  itemSala:       { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ED145B22', flexDirection: 'row', justifyContent: 'space-between' },
  itemSalaAtivo:  { backgroundColor: '#ED145B18', borderRadius: 8 },
  itemTexto:      { color: '#ED145B', fontSize: 16, fontWeight: '700' },
  itemVagas:      { color: '#ED145B', fontSize: 13, opacity: 0.7 },
});