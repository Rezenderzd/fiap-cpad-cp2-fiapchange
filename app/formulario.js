import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Modal, FlatList, Switch } from 'react-native';
import React, { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from './provider.js';

export default function Home() {
  const router = useRouter();
  const { salas, removerVaga, adicionarVaga, adicionarAoHistorico, isDarkMode, toggleSwitchDarkMode} = useContext(AppContext);

  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [salaAtual, setSalaAtual] = useState(null);
  const [salaDestino, setSalaDestino] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoSelecao, setTipoSelecao] = useState('');

  const apagarDados = () => {
    setNome('');
    setSalaAtual(null);
    setSalaDestino(null);
    setMotivo('');
  };

  const abrirSelecao = (tipo) => {
    setTipoSelecao(tipo);
    setModalVisible(true);
  };

  const selecionarSala = (sala) => {
    if (tipoSelecao === 'atual') setSalaAtual(sala);
    else setSalaDestino(sala);
    setModalVisible(false);
  };

  const processarTroca = () => {
    const chance = Math.random();
    const motivosFalha = [
      "Seu Motivo não foi aceito.",
      "Existem muitos alunos com interesse nessa sala.",
      "Devido ao seu baixo desempenho acadêmico sua solicitação foi negada.",
      "Atualmente a mudança de sala está fora do ar.",
      "O coordenador do curso precisa validar esta troca manualmente.",
      "Aluno já possui uma solicitação pendente."
    ];

    if (chance > 0.7) {
      const motivoAleatorio = motivosFalha[Math.floor(Math.random() * motivosFalha.length)];
      Alert.alert('Solicitação Negada', motivoAleatorio);
      return;
    }

    adicionarAoHistorico(nome, salaAtual.sala, salaDestino.sala);
    adicionarVaga(salaAtual.sala);
    removerVaga(salaDestino.sala);

    Alert.alert('Sucesso', `Mudança de ${nome} processada para ${salaDestino.sala.toUpperCase()}!\nMotivo: ${motivo}`);
    apagarDados();
  };

  const enviarDados = () => {
    if (!nome.trim() || !salaAtual || !salaDestino || !motivo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (salaAtual.sala === salaDestino.sala) {
      Alert.alert('Erro', 'A sala de destino deve ser diferente da atual.');
      return;
    }

    if (salaDestino.vagas <= 0) {
      Alert.alert('Erro', 'A sala de destino não possui mais vagas.');
      return;
    }

    Alert.alert(
      "Confirmar Solicitação",
      `Deseja confirmar a troca de ${nome} da sala ${salaAtual.sala.toUpperCase()} para a ${salaDestino.sala.toUpperCase()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: processarTroca }
      ]
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
      <Switch
        value = {isDarkMode}
        onValueChange={toggleSwitchDarkMode}
        style={styles.switch}
      />
      <View style={styles.containerPerguntas}>
        <View style={styles.blocoPergunta}>
          <Text style={styles.pergunta}>Nome:</Text>
          <TextInput 
            placeholder="Seu nome" 
            placeholderTextColor= '#fff' 
            style={styles.input} 
            onChangeText={setNome} 
            value={nome} 
          />
        </View>

        <View style={styles.blocoPergunta}>
          <Text style={styles.pergunta}>Sala Atual:</Text>
          <TouchableOpacity style={styles.seletor} onPress={() => abrirSelecao('atual')}>
            <Text style={styles.seletorTexto}>{salaAtual ? salaAtual.sala.toUpperCase() : "Selecionar sala..."}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.blocoPergunta}>
          <Text style={styles.pergunta}>Sala Destino:</Text>
          <TouchableOpacity style={styles.seletor} onPress={() => abrirSelecao('destino')}>
            <Text style={styles.seletorTexto}>{salaDestino ? salaDestino.sala.toUpperCase() : "Selecionar sala..."}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.blocoPergunta}>
          <Text style={styles.pergunta}>Motivo da Troca:</Text>
          <TextInput 
            placeholder="Explique o motivo" 
            placeholderTextColor= '#fff' 
            style={[styles.input, { height: 60 }]} 
            onChangeText={setMotivo} 
            value={motivo} 
            multiline={true}
          />
        </View>

        <View style={styles.campoBotoes}>
          <TouchableOpacity style={styles.botaoApagar} onPress={apagarDados}>
            <Text style={styles.botaoTexto}>Apagar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoEnviar} onPress={enviarDados}>
            <Text style={styles.botaoTexto}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/salas')}>
          <Text style={styles.pergunta}>Ver lista de salas →</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalConteudo, {backgroundColor: isDarkMode? '#000': '#fff'}]}>
              <Text style={styles.modalTitulo}>Escolha a Sala</Text>
              <FlatList
                data={salas}
                keyExtractor={(item) => item.sala}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.itemSala} onPress={() => selecionarSala(item)}>
                    <Text style={styles.itemTexto}>{item.sala.toUpperCase()}</Text>
                    <Text style={styles.itemVagas}>{item.vagas} vagas</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisible(false)}>
                <Text style={styles.botaoTextoFechar}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 30 },
  switch:{ position: 'absolute', top: 40, right: 20 },
  containerPerguntas:{marginTop: 50},
  blocoPergunta: { marginBottom: 15, gap: 5 },
  pergunta: { color: '#ED145B', fontSize: 16 },
  input: { width: 300, backgroundColor: '#ED145B', borderRadius: 8, padding: 12, fontSize: 14, color: '#fff'},
  seletor: { width: 300, backgroundColor: '#ED145B', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#ED145B' },
  seletorTexto: { color: '#fff' },
  campoBotoes: { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', gap: 20 },
  botaoApagar: { backgroundColor: '#ED145B', padding: 16, borderRadius: 12, alignItems: 'center', width: 140},
  botaoEnviar: { backgroundColor: '#0ed145', padding: 16, borderRadius: 12, alignItems: 'center', width: 140 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  botaoTextoFechar: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalConteudo: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '50%' },
  modalTitulo: { color: '#ED145B', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  itemSala: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', justifyContent: 'space-between' },
  itemTexto: { color: '#ED145B', fontSize: 16 },
  itemVagas: { color: '#ED145B' },
  botaoFechar: { marginTop: 10, backgroundColor: '#ED145B', padding: 15, borderRadius: 10, alignItems: 'center' }
});