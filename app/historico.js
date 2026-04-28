import { View, Text, StyleSheet, Switch} from 'react-native';
import { useContext } from 'react';
import { AppContext } from './provider.js';

export default function Historico() {
    const { historico, isDarkMode, toggleSwitchDarkMode } = useContext(AppContext);

    return(
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
          <Switch
            value = {isDarkMode}
            onValueChange={toggleSwitchDarkMode}
            style={styles.switch}
          />
          <Text style = {styles.titulo}>Histórico de Troca</Text>
            <View>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{flex: 1, alignItems: 'center', paddingTop: 30 },
    switch: {position: 'absolute', top: 40, right: 20 },
    titulo: {fontSize:25, color: '#ED145B', marginBottom: 20},
    itemLog: { borderBottomWidth:2, paddingVertical: 12, color: '#ED145B', borderBottomColor: '#ED145B', width: 300, alignItems:'center'},
    textoLog: {fontSize: 20, color:'#ED145B', textAlign:'center' },
    horaLog: {fontSize: 16, marginTop: 4, textAlign: 'right', color: '#ED145B' },
    vazio: {textAlign: 'center', marginTop: 50, color: '#ED145B' },
})