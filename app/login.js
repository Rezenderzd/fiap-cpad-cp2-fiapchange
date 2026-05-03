import {
  View, Text, StyleSheet, Alert, Animated, Image,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from './provider.js';
import InputField from './components/InputField.js';
import PrimaryButton from './components/PrimaryButton.js';

export default function Login() {
  const router = useRouter();
  const { login, isDarkMode, usuarioLogado, authCarregado } = useContext(AppContext);

  const [email,        setEmail]        = useState('');
  const [senha,        setSenha]        = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros,        setErros]        = useState({});
  const [carregando,   setCarregando]   = useState(false);

  // Se já está logado, vai direto pra home
  useEffect(() => {
    if (authCarregado && usuarioLogado) router.replace('/');
  }, [authCarregado, usuarioLogado]);

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
    if (!email.trim())  e.email = 'Informe seu e-mail.';
    if (!senha.trim())  e.senha = 'Informe sua senha.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;
    setCarregando(true);
    const resultado = await login(email, senha);
    setCarregando(false);
    if (resultado.ok) {
      router.replace('/');
    } else {
      Alert.alert('Erro ao entrar', resultado.mensagem);
      setErros({ geral: resultado.mensagem });
    }
  };

  const bg     = isDarkMode ? '#000' : '#fff';
  const cardBg = isDarkMode ? '#111' : '#f5f5f5';

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
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://www.100security.com.br/images/e-u-br-fiap.png' }}
                style={styles.logo}
              />
              <Text style={styles.titulo}>FiapChange</Text>
              <Text style={[styles.subtitulo, { color: isDarkMode ? '#888' : '#666' }]}>
                Entre na sua conta
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg }]}>

              <InputField
                label="E-mail"
                icon="✉️"
                value={email}
                onChangeText={(t) => { setEmail(t); setErros((e) => ({ ...e, email: '', geral: '' })); }}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                erro={erros.email}
              />

              <InputField
                label="Senha"
                icon="🔒"
                value={senha}
                onChangeText={(t) => { setSenha(t); setErros((e) => ({ ...e, senha: '', geral: '' })); }}
                placeholder="Sua senha"
                secureTextEntry
                senhaVisivel={senhaVisivel}
                onToggleSenha={() => setSenhaVisivel((v) => !v)}
                autoCapitalize="none"
                erro={erros.senha}
              />

              {erros.geral ? (
                <Text style={styles.erroGeral}>{erros.geral}</Text>
              ) : null}

              <PrimaryButton
                label={carregando ? 'ENTRANDO...' : 'ENTRAR'}
                onPress={handleLogin}
                fullWidth
              />

              <View style={styles.divider}>
                <View style={[styles.linha, { backgroundColor: isDarkMode ? '#333' : '#ddd' }]} />
                <Text style={[styles.dividerTexto, { color: isDarkMode ? '#555' : '#aaa' }]}>ou</Text>
                <View style={[styles.linha, { backgroundColor: isDarkMode ? '#333' : '#ddd' }]} />
              </View>

              <TouchableOpacity onPress={() => router.push('/cadastro')} style={styles.linkBox}>
                <Text style={[styles.linkTexto, { color: isDarkMode ? '#888' : '#666' }]}>
                  Não tem conta?{' '}
                  <Text style={styles.linkDestaque}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:        { flexGrow: 1, alignItems: 'center', paddingBottom: 40 },
  decorCircle1:  { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#ED145B', opacity: 0.06, top: -80, right: -80 },
  decorCircle2:  { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#ED145B', opacity: 0.04, bottom: 60, left: -60 },
  inner:         { width: '100%', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  header:        { alignItems: 'center', marginBottom: 36 },
  logo:          { width: 100, height: 100, marginBottom: 16, borderRadius: 16 },
  titulo:        { fontSize: 34, fontWeight: '800', color: '#ED145B', letterSpacing: 1 },
  subtitulo:     { fontSize: 15, marginTop: 4 },
  card:          { width: '100%', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ED145B22', elevation: 6 },
  erroGeral:     { color: '#ED145B', textAlign: 'center', marginBottom: 12, fontSize: 13 },
  divider:       { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  linha:         { flex: 1, height: 1 },
  dividerTexto:  { fontSize: 13 },
  linkBox:       { alignItems: 'center' },
  linkTexto:     { fontSize: 14 },
  linkDestaque:  { color: '#ED145B', fontWeight: '700' },
});