import {
  View, Text, StyleSheet, Alert, Animated, Image,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback,
  Keyboard, Modal, FlatList, TouchableOpacity,
} from 'react-native';
import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from './provider.js';
import InputField from './components/InputField.js';
import PrimaryButton from './components/PrimaryButton.js';

export default function Cadastro() {
  const router = useRouter();
  const { isDarkMode, salas, cadastrar, usuarioLogado, authCarregado } = useContext(AppContext);

  // Se já está logado, redireciona
  useEffect(() => {
    if (authCarregado && usuarioLogado) router.replace('/');
  }, [authCarregado, usuarioLogado]);

  const [nomeCompleto,      setNomeCompleto]      = useState('');
  const [email,             setEmail]             = useState('');
  const [senha,             setSenha]             = useState('');
  const [confirmarSenha,    setConfirmarSenha]    = useState('');
  const [salaSelecionada,   setSalaSelecionada]   = useState(null);
  const [senhaVisivel,      setSenhaVisivel]      = useState(false);
  const [confirmarSenhaVis, setConfirmarSenhaVis] = useState(false);
  const [modalSala,         setModalSala]         = useState(false);
  const [erros,             setErros]             = useState({});

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validar = () => {
    const e = {};
    if (!nomeCompleto.trim() || nomeCompleto.trim().split(' ').length < 2)
      e.nomeCompleto = 'Informe nome e sobrenome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Informe um e-mail válido.';
    if (!salaSelecionada)
      e.sala = 'Selecione sua sala.';
    if (senha.length < 6)
      e.senha = 'Mínimo 6 caracteres.';
    if (senha !== confirmarSenha)
      e.confirmarSenha = 'As senhas não coincidem.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastro = async () => {
    if (!validar()) return;
    await cadastrar({ nomeCompleto, email, senha, sala: salaSelecionada.sala });
    Alert.alert(
      'Conta criada! 🎉',
      `Bem-vindo(a), ${nomeCompleto.split(' ')[0]}!\nSua sala: ${salaSelecionada.sala.toUpperCase()}`,
      [{ text: 'Entrar', onPress: () => router.replace('/') }]
    );
  };

  const bg     = isDarkMode ? '#000' : '#fff';
  const cardBg = isDarkMode ? '#111' : '#f5f5f5';
  const inputBg = isDarkMode ? '#1A1A1A' : '#e8e8e8';
  const textClr = isDarkMode ? '#fff' : '#111';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { backgroundColor: bg }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <Animated.View
            style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://www.100security.com.br/images/e-u-br-fiap.png' }}
                style={styles.logo}
              />
              <Text style={styles.titulo}>Criar Conta</Text>
              <Text style={[styles.subtitulo, { color: isDarkMode ? '#888' : '#666' }]}>
                Junte-se ao FiapChange
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg }]}>

              <InputField
                label="Nome Completo"
                icon="👤"
                value={nomeCompleto}
                onChangeText={(t) => { setNomeCompleto(t); setErros((e) => ({ ...e, nomeCompleto: '' })); }}
                placeholder="Seu nome completo"
                autoCapitalize="words"
                erro={erros.nomeCompleto}
              />

              <InputField
                label="E-mail"
                icon="✉️"
                value={email}
                onChangeText={(t) => { setEmail(t); setErros((e) => ({ ...e, email: '' })); }}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                erro={erros.email}
              />

              {/* Seletor de sala — campo customizado */}
              <View style={styles.campoSala}>
                <Text style={styles.label}>Minha Sala</Text>
                <TouchableOpacity
                  style={[
                    styles.seletorRow,
                    { backgroundColor: inputBg },
                    erros.sala && styles.seletorErro,
                  ]}
                  onPress={() => setModalSala(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.seletorIcone}>🏫</Text>
                  <Text style={[
                    styles.seletorTexto,
                    { color: salaSelecionada ? textClr : (isDarkMode ? '#555' : '#aaa') }
                  ]}>
                    {salaSelecionada ? salaSelecionada.sala.toUpperCase() : 'Selecionar sala...'}
                  </Text>
                  <Text style={styles.seletorSeta}>›</Text>
                </TouchableOpacity>
                {erros.sala ? <Text style={styles.erroTexto}>{erros.sala}</Text> : null}
              </View>

              <InputField
                label="Senha"
                icon="🔒"
                value={senha}
                onChangeText={(t) => { setSenha(t); setErros((e) => ({ ...e, senha: '' })); }}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                senhaVisivel={senhaVisivel}
                onToggleSenha={() => setSenhaVisivel((v) => !v)}
                autoCapitalize="none"
                erro={erros.senha}
              />

              <InputField
                label="Confirmar Senha"
                icon="🔑"
                value={confirmarSenha}
                onChangeText={(t) => { setConfirmarSenha(t); setErros((e) => ({ ...e, confirmarSenha: '' })); }}
                placeholder="Repita a senha"
                secureTextEntry
                senhaVisivel={confirmarSenhaVis}
                onToggleSenha={() => setConfirmarSenhaVis((v) => !v)}
                autoCapitalize="none"
                erro={erros.confirmarSenha}
              />

              <PrimaryButton label="CRIAR CONTA" onPress={handleCadastro} fullWidth />

              <View style={styles.divider}>
                <View style={[styles.linha, { backgroundColor: isDarkMode ? '#333' : '#ddd' }]} />
                <Text style={[styles.dividerTexto, { color: isDarkMode ? '#555' : '#aaa' }]}>ou</Text>
                <View style={[styles.linha, { backgroundColor: isDarkMode ? '#333' : '#ddd' }]} />
              </View>

              <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkBox}>
                <Text style={[styles.linkTexto, { color: isDarkMode ? '#888' : '#666' }]}>
                  Já tem uma conta?{' '}
                  <Text style={styles.linkDestaque}>Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal seleção de sala */}
      <Modal visible={modalSala} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
            <Text style={styles.modalTitulo}>Selecione sua Sala</Text>
            <FlatList
              data={salas}
              keyExtractor={(item) => item.sala}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemSala,
                    salaSelecionada?.sala === item.sala && styles.itemSalaAtivo,
                  ]}
                  onPress={() => {
                    setSalaSelecionada(item);
                    setErros((e) => ({ ...e, sala: '' }));
                    setModalSala(false);
                  }}
                >
                  <Text style={styles.itemSalaTexto}>{item.sala.toUpperCase()}</Text>
                  <Text style={styles.itemSalaVagas}>{item.vagas} vagas disponíveis</Text>
                </TouchableOpacity>
              )}
            />
            <PrimaryButton label="Fechar" onPress={() => setModalSala(false)} fullWidth />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:        { flexGrow: 1, alignItems: 'center', paddingBottom: 40 },
  decorCircle1:  { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#ED145B', opacity: 0.06, top: -80, right: -80 },
  decorCircle2:  { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#ED145B', opacity: 0.04, bottom: 60, left: -60 },
  inner:         { width: '100%', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
  header:        { alignItems: 'center', marginBottom: 28 },
  logo:          { width: 90, height: 90, marginBottom: 12, borderRadius: 12 },
  titulo:        { fontSize: 30, fontWeight: '800', color: '#ED145B', letterSpacing: 1 },
  subtitulo:     { fontSize: 14, marginTop: 4 },
  card:          { width: '100%', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ED145B22', elevation: 6 },
  campoSala:     { marginBottom: 16 },
  label:         { color: '#ED145B', fontSize: 13, fontWeight: '700', marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  seletorRow:    { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1.5, borderColor: 'transparent' },
  seletorErro:   { borderColor: '#ED145B' },
  seletorIcone:  { fontSize: 16, marginRight: 8 },
  seletorTexto:  { flex: 1, fontSize: 15, paddingVertical: 12 },
  seletorSeta:   { color: '#ED145B', fontSize: 20 },
  erroTexto:     { color: '#ED145B', fontSize: 12, marginTop: 4, marginLeft: 4 },
  divider:       { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  linha:         { flex: 1, height: 1 },
  dividerTexto:  { fontSize: 13 },
  linkBox:       { alignItems: 'center' },
  linkTexto:     { fontSize: 14 },
  linkDestaque:  { color: '#ED145B', fontWeight: '700' },
  modalOverlay:  { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.75)' },
  modalBox:      { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '55%', borderTopWidth: 2, borderColor: '#ED145B' },
  modalTitulo:   { color: '#ED145B', fontSize: 20, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  itemSala:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#ED145B22' },
  itemSalaAtivo: { backgroundColor: '#ED145B18', borderRadius: 8 },
  itemSalaTexto: { color: '#ED145B', fontSize: 17, fontWeight: '700' },
  itemSalaVagas: { color: '#ED145B', fontSize: 13, opacity: 0.7 },
});