import { Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { AppContext, AppProvider } from './provider';
import { useContext, useEffect } from 'react';
import { View, ActivityIndicator, Switch } from 'react-native';
 
export default function RootLayout() {
  return (
    <AppProvider>
      <AuthGuard />
    </AppProvider>
  );
}
 
const ROTAS_PUBLICAS = ['login', 'cadastro'];
 
function AuthGuard() {
  const { usuarioLogado, authCarregado, isDarkMode } = useContext(AppContext);
  const segments = useSegments();
  const router   = useRouter();
 
  useEffect(() => {
    if (!authCarregado) return;
 
    const rotaAtual   = segments[segments.length - 1] ?? '';
    const ehPublica   = ROTAS_PUBLICAS.includes(rotaAtual);
    const estaLogado  = !!usuarioLogado;
 
    if (!estaLogado && !ehPublica) {
      router.replace('/login');
    } else if (estaLogado && ehPublica) {
      router.replace('/');
    }
  }, [authCarregado, usuarioLogado, segments]);
 
  if (!authCarregado) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#000' : '#fff' }}>
        <ActivityIndicator size="large" color="#ED145B" />
      </View>
    );
  }
 
  return <Layout />;
}
 
function Layout() {
  const { isDarkMode, toggleSwitchDarkMode } = useContext(AppContext);
 
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ED145B',
        tabBarStyle:      { backgroundColor: isDarkMode ? '#000' : '#fff' },
        headerStyle:      { backgroundColor: isDarkMode ? '#000' : '#fff' },
        headerTitleStyle: { color: '#ED145B' },
        headerRight: () => (
          <Switch
            value={isDarkMode}
            onValueChange={toggleSwitchDarkMode}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="formulario"
        options={{
          title: 'Formulário',
          tabBarIcon: ({ color }) => <AntDesign name="form" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="salas"
        options={{
          title: 'Salas',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="google-classroom" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} />,
        }}
      />
 
      <Tabs.Screen name="login"    options={{ href: null, headerShown: false, title: 'Login' }} />
      <Tabs.Screen name="cadastro" options={{ href: null, headerShown: false, title: 'Cadastro' }} />
 
      <Tabs.Screen name="components/InputField"    options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="components/PrimaryButton" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="components/UserCard"      options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="components/OccupancyBar"  options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}