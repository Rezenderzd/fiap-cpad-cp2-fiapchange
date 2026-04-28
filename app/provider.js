import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();
export const AppProvider = ({ children }) => {

    const [salas, setSalas] = useState([
        {
            sala: '2CCPO',
            vagas: 2,
            capacidade: 40,
        },
        {
            sala: '2CCPW',
            vagas: 6,
            capacidade: 40,
        },
        {
            sala: '2CCPH',                  //sala flopada
            vagas: 13,
            capacidade: 40,
        },
        {
            sala: '2CCPG',
            vagas: 7,
            capacidade: 40,
        },
        {
            sala: '2CCPI',
            vagas: 8,
            capacidade: 40,
        },

    ]);

    useEffect(() =>{
        carregarHistorico()
    },[])
    
    const removerVaga = (salaDigitada) => {
        setSalas((prevSalas) =>
            prevSalas.map((item) => {
                if (item.sala.toUpperCase().includes(salaDigitada.toUpperCase().trim())) {
                    return { ...item, vagas: item.vagas - 1 };
                }
                return item;
            })
        );
    }

    const adicionarVaga = (salaDigitada) => {
        setSalas((prevSalas) =>
            prevSalas.map((item) => {
                if (item.sala.toUpperCase().includes(salaDigitada.toUpperCase().trim())) {
                    return { ...item, vagas: item.vagas + 1 };
                }
                return item;
            })
        );
    }

    const totalAlunosGlobal = salas.reduce((soma, item) => {
        const alunosNaSala = item.capacidade - item.vagas;
        return soma + alunosNaSala;
    }, 0);


    const [historico, setHistorico] = useState([]);

    const adicionarAoHistorico = (aluno, salaAntiga, salaAtual) => {
        const novaEntrada = {
            id: Math.random().toString(), // id único para o map, clean code para n ficar cheio de alert
            texto: `${aluno} mudou da ${salaAntiga.toUpperCase()} para ${salaAtual.toUpperCase()}.`,
            data: new Date().toLocaleTimeString(), // date time do js 
        };

      // Usamos o [novo, ...antigos] para o mais recente ficar no TOPO
      const novoHistorico = [novaEntrada, ...historico]
      setHistorico(novoHistorico);
      salvarHistorico(novoHistorico)
    };

    const salvarHistorico = async (historico) =>{
        await AsyncStorage.setItem('historico', JSON.stringify(historico));
    }

    const carregarHistorico = async () =>{
        const historico = await AsyncStorage.getItem('historico');
        if (historico) setHistorico(JSON.parse(historico));
    }

    const [isDarkMode, setIsDarkMode] = useState(true);
    const toggleSwitchDarkMode = () => setIsDarkMode(previousState => !previousState);


    return (
        <AppContext.Provider value={{ salas, setSalas, adicionarVaga, removerVaga, totalAlunosGlobal, historico, setHistorico, adicionarAoHistorico, isDarkMode, toggleSwitchDarkMode}}>
            {children}
        </AppContext.Provider>
    );
}