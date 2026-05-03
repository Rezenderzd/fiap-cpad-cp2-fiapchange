import { View, Text, StyleSheet, Animated, useEffect as _u } from 'react-native';
import { useEffect, useRef } from 'react';


export default function OccupancyBar({ capacidade, vagas }) {
  const ocupados   = capacidade - vagas;
  const percentual = capacidade > 0 ? ocupados / capacidade : 0;


  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percentual,
      duration: 800,
      useNativeDriver: false, 
    }).start();
  }, [percentual]);

  // Cor dinâmica conforme ocupação
  const cor =
    percentual < 0.5  ? '#0ed145' :   
    percentual < 0.8  ? '#f5a623' :   
                        '#ED145B';    

  const largura = animWidth.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.trilha}>
        <Animated.View style={[styles.barra, { width: largura, backgroundColor: cor }]} />
      </View>
      <Text style={[styles.texto, { color: cor }]}>
        {ocupados}/{capacidade} alunos ({Math.round(percentual * 100)}%)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 6, gap: 4 },
  trilha:  { height: 6, borderRadius: 99, backgroundColor: '#333', overflow: 'hidden' },
  barra:   { height: '100%', borderRadius: 99 },
  texto:   { fontSize: 11, fontWeight: '600', textAlign: 'right' },
});