import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../provider.js';


export default function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  erro,
  secureTextEntry = false,
  senhaVisivel,
  onToggleSenha,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  badgeTexto,
}) {
  const { isDarkMode } = useContext(AppContext);

  const inputBg  = editable
    ? (isDarkMode ? '#1A1A1A' : '#e8e8e8')
    : (isDarkMode ? '#111'    : '#f0f0f0');
  const textClr  = isDarkMode ? '#fff' : '#111';

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[
        styles.row,
        { backgroundColor: inputBg },
        erro      && styles.rowErro,
        !editable && styles.rowReadOnly,
      ]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}

        <TextInput
          style={[styles.input, { color: editable ? textClr : (isDarkMode ? '#aaa' : '#555') }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#555' : '#aaa'}
          secureTextEntry={secureTextEntry && !senhaVisivel}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
        />

        {/* Toggle de senha */}
        {onToggleSenha ? (
          <TouchableOpacity onPress={onToggleSenha} style={styles.olhoBtn}>
            <Text>{senhaVisivel ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : null}

        {/* Badge (ex: "seu perfil") */}
        {badgeTexto ? (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{badgeTexto}</Text>
          </View>
        ) : null}
      </View>

      {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:     { marginBottom: 16 },
  label:       { color: '#ED145B', fontSize: 13, fontWeight: '700', marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  row:         { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1.5, borderColor: 'transparent' },
  rowErro:     { borderColor: '#ED145B' },
  rowReadOnly: { opacity: 0.85 },
  icon:        { fontSize: 16, marginRight: 8 },
  input:       { flex: 1, fontSize: 15, paddingVertical: 12 },
  olhoBtn:     { padding: 4 },
  badge:       { backgroundColor: '#ED145B22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTexto:  { color: '#ED145B', fontSize: 11, fontWeight: '700' },
  erroTexto:   { color: '#ED145B', fontSize: 12, marginTop: 4, marginLeft: 4 },
});