import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { AppContext, AppProvider } from './provider';
import { useContext } from 'react';

export default function RootLayout() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}


function Layout() {
  
  const {isDarkMode} = useContext(AppContext);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#ED145B', tabBarStyle:{ backgroundColor: isDarkMode? '#000': '#fff'}, headerStyle:{backgroundColor: isDarkMode? '#000': '#fff'}, headerTitleStyle:{color:'#ED145B'} }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="formulario"
          options={{
            title: 'Formulario',
            tabBarIcon: ({ color }) => <AntDesign name="form" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="salas"
          options={{
            title: 'Salas',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="google-classroom" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="historico"
          options={{
            title: 'Historico',
            tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} />
          }}
        />
    </Tabs>
  );
}