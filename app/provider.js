import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [salas, setSalas] = useState([
        { sala: '2CCPO', vagas: 2,  capacidade: 40 },
        { sala: '2CCPW', vagas: 6,  capacidade: 40 },
        { sala: '2CCPH', vagas: 13, capacidade: 40 }, /// sala flopada
        { sala: '2CCPG', vagas: 7,  capacidade: 40 },
        { sala: '2CCPI', vagas: 8,  capacidade: 40 },
    ]);

    //  Autenticando...

    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [authCarregado, setAuthCarregado] = useState(false); 

    useEffect(() => {
        const inicializar = async () => {
            const dadosSalvos = await AsyncStorage.getItem('salas_data');
            if (dadosSalvos) {
                setSalas(JSON.parse(dadosSalvos));
            }
            await carregarHistorico();
            const sessao = await AsyncStorage.getItem('sessao');
            if (sessao) setUsuarioLogado(JSON.parse(sessao));
            setAuthCarregado(true);
        };
        inicializar();
    }, []);

    const cadastrar = async ({ nomeCompleto, email, senha, sala }) => {
        const usuario = { nomeCompleto, email, senha, sala };
        await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
        await AsyncStorage.setItem('sessao', JSON.stringify(usuario));
        setUsuarioLogado(usuario);
    };

    const login = async (emailDigitado, senhaDigitada) => {
        const raw = await AsyncStorage.getItem('usuario');
        if (!raw) return { ok: false, mensagem: 'Nenhuma conta cadastrada.' };
        const usuario = JSON.parse(raw);
        if (
            usuario.email.toLowerCase() === emailDigitado.toLowerCase() &&
            usuario.senha === senhaDigitada
        ) {
            await AsyncStorage.setItem('sessao', JSON.stringify(usuario));
            setUsuarioLogado(usuario);
            return { ok: true };
        }
        return { ok: false, mensagem: 'E-mail ou senha incorretos.' };
    };

    const logout = async () => {
        await AsyncStorage.removeItem('sessao');
        setUsuarioLogado(null);
    };

    const atualizarSalaUsuario = async (novaSala) => {
        const atualizado = { ...usuarioLogado, sala: novaSala };
        await AsyncStorage.setItem('usuario', JSON.stringify(atualizado));
        await AsyncStorage.setItem('sessao', JSON.stringify(atualizado));
        setUsuarioLogado(atualizado);
    };

    // Salas
    const removerVaga = (salaDigitada) => {
        setSalas((prev) => {
            const novasSalas = prev.map((item) =>
                item.sala.toUpperCase().includes(salaDigitada.toUpperCase().trim())
                    ? { ...item, vagas: item.vagas - 1 }
                    : item
            );
            salvarSalas(novasSalas); 
            return novasSalas;
        });
    };

    const adicionarVaga = (salaDigitada) => {
        setSalas((prev) => {
            const novasSalas = prev.map((item) =>
                item.sala.toUpperCase().includes(salaDigitada.toUpperCase().trim())
                    ? { ...item, vagas: item.vagas + 1 }
                    : item
            );
            salvarSalas(novasSalas);
            return novasSalas;
        });
    };

    const salvarSalas = async (novasSalas) => {
        const jsonValue = JSON.stringify(novasSalas);
        await AsyncStorage.setItem('salas_data', jsonValue); 
};
    const totalAlunosGlobal = salas.reduce(
        (soma, item) => soma + (item.capacidade - item.vagas), 0
    );

    // Histórico
    const [historico, setHistorico] = useState([]);

    const adicionarAoHistorico = (aluno, salaAntiga, salaNova) => {
        const novaEntrada = {
            id: Math.random().toString(),
            texto: `${aluno} mudou da ${salaAntiga.toUpperCase()} para ${salaNova.toUpperCase()}.`,
            data: new Date().toLocaleTimeString(),
        };
        const novoHistorico = [novaEntrada, ...historico];
        setHistorico(novoHistorico);
        salvarHistorico(novoHistorico);
    };

    const salvarHistorico = async (hist) => {
        await AsyncStorage.setItem('historico', JSON.stringify(hist));
    };

    const carregarHistorico = async () => {
        const hist = await AsyncStorage.getItem('historico');
        if (hist) setHistorico(JSON.parse(hist));
    };

    // Dark Mode 
    const [isDarkMode, setIsDarkMode] = useState(true);
    const toggleSwitchDarkMode = () => setIsDarkMode((prev) => !prev);

    return (
        <AppContext.Provider
            value={{
                salas, setSalas, adicionarVaga, removerVaga, totalAlunosGlobal,
                historico, setHistorico, adicionarAoHistorico,
                usuarioLogado, authCarregado, cadastrar, login, logout, atualizarSalaUsuario,
                isDarkMode, toggleSwitchDarkMode,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};