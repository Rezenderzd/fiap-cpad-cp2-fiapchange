import { TouchableOpacity, Text, StyleSheet } from 'react-native';


export default function PrimaryButton({ label, onPress, color = '#ED145B', fullWidth = false, small = false }) {
  return (
    <TouchableOpacity
      style={[
        styles.botao,
        { backgroundColor: color },
        fullWidth && styles.fullWidth,
        small     && styles.small,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.texto, small && styles.textoSmall]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao:     { backgroundColor: '#ED145B', padding: 16, borderRadius: 14, alignItems: 'center', elevation: 6, shadowColor: '#ED145B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 },
  fullWidth: { width: '100%' },
  small:     { padding: 10, borderRadius: 20, elevation: 2 },
  texto:     { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1.5 },
  textoSmall:{ fontSize: 13, letterSpacing: 0.5 },
});