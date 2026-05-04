#  Gestão de Mudança de Salas para a FIAP (FiapChange)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=D04A37)
![Context API](https://img.shields.io/badge/Context_API-563D7C?style=for-the-badge&logo=react&logoColor=white)

## 🎯 Sobre o Projeto
Anteriormente, o processo de solicitação e atualização de mudança de salas na **FIAP** era um processo manual e demorado. Este aplicativo foi desenvolvido para modernizar essa gestão, permitindo que alunos e administradores realizem a troca de ambiente com apenas alguns cliques.

O sistema gerencia em tempo real a disponibilidade de vagas, garantindo que nenhuma sala ultrapasse sua capacidade máxima e mantendo o histórico de motivos da troca.

## 🎓 Funcionalidades
* **Formulário Inteligente:** Cadastro de troca com validação de existência de sala e campo de motivo.
* **Gestão de Vagas (Real-time):** Ao realizar uma troca, o app libera 1 vaga na sala de origem e ocupa 1 vaga na sala de destino.
* **Suporte a Identificadores FIAP:** Aceita salas com nomes alfanuméricos (ex: `2ccpo` e `2ccpw`).
* **Visualização de Status:** Listagem dinâmica com `map` de todas as salas e suas respectivas ocupações.
* **Histórico de Trocas (Modal):** Visualização centralizada de todas as atividades realizadas, acessível via Modal, garantindo uma interface mais limpaS.
* **Cálculo Global de Alunos:** Monitoramento em tempo real do total de alunos matriculados em todas as salas, utilizando funções de agregação (`reduce`) no Contexto.
* **Algoritmo para validação:** Utilização de Math.random para determinar se a mudança de sala será efetuada ou não, com uma chance de 70% de sucesso.

## 🛠️ Tecnologias Utilizadas
* **Framework:** Expo (React Native)
* **Navegação:** Expo Router
* **Gerenciamento de Estado:** React Context API (Provider Pattern)
* **Estilização:** StyleSheet (Design System FIAP: Dark & Pink)


## 🏁 Como Iniciar

### Pré-requisitos
* Node.js instalado.
* Aplicativo **Expo Go** instalado no seu dispositivo móvel.
* Android Studio para simular o celular caso desejado.

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Rezenderzd/cp1-react-native.git
2. Instale as dependências:

    ```Bash
    npm install --legacy-peer-deps
    ```
3. Inicie o servidor com limpeza de cache:

    ```Bash
    npx expo start -c
    ```

### 📖 Como Funciona? (Regra de Negócio)
O aplicativo utiliza o Provider para garantir que as atualizações de estado sejam seguras:

1. **Validação:** O sistema busca as salas no AppContext ignorando diferenças entre maiúsculas e minúsculas.

2. **Troca de Vagas:** * adicionarVaga(salaAtual): Soma +1 na sala de onde o aluno saiu.

3. **Rastreabilidade (Logs):** Ao confirmar uma troca, o sistema dispara a função adicionarAoHistorico, gerando um registro imutável com ID único e horário da operação.

4. **Sincronização Global:** Os dados são refletidos instantaneamente na listagem de salas e no Modal de Histórico, sem a necessidade de recarregar o aplicativo.


### 🖼️Gif do projeto em prática (Demonstração)
<p align="center">
<img src="./gifs-e-images/untitled.gif"width="300">
</p>

<br> 

### 🐱‍👤📷 Alguns prints para melhor visualização
<p align="center">
  <img src="./gifs-e-images/paginalogin.png" width="180" alt="Salas disponiveis" />
  <img src="./gifs-e-images/paginacadastro.png" width="180" alt="Salas disponiveis" />
  <img src="./gifs-e-images/salasdisponiveis.png" width="180" alt="Salas disponiveis" />
  <img src="./gifs-e-images/Formulario.png" width="180" alt="Salas" />
  <img src="./gifs-e-images/whitemode.png" width="180" alt="Historico" />
  <img src="./gifs-e-images/historico.png" width="180" alt="Historico" />
</p>

### Estrutura do Projeto
 
```
app/
├── _layout.js              # Layout raiz: AppProvider + AuthGuard + Tabs
├── index.js                # Tela Home 
├── formulario.js           # Tela de solicitação de troca de sala
├── salas.js                # Tela de listagem de salas e ocupação
├── historico.js            # Tela de histórico de trocas
├── login.js                # Tela de login 
├── cadastro.js             # Tela de cadastro 
├── provider.js             # AppContext + AppProvider (estado global)
└── components/
    ├── InputField.js       # Campo de texto reutilizável com label, ícone e erro
    ├── PrimaryButton.js    # Botão primário com suporte a variantes (fullWidth, small)
    ├── OccupancyBar.js     # Barra de ocupação animada com cor dinâmica
    └── UserCard.js         # Card do usuário logado com nome, sala e botão de logout
```
 
<!-- ### Context Criado
 
O projeto utiliza um único `AppContext` (em `provider.js`) que centraliza toda a lógica da aplicação:
 
- **Autenticação:** usuarioLogado, authCarregado, e as funções cadastrar, login, logout e atualizarSalaUsuario.
- **Salas:** array salas com as funções adicionarVaga, removerVaga e salvarSalas (persiste no AsyncStorage).
- **Histórico:** array historico com adicionarAoHistorico, salvarHistorico e carregarHistorico.
- **Computed value:** totalAlunosGlobal calculado via `reduce()` diretamente no Provider, disponível em todas as telas.
- **Tema:** `isDarkMode` e `toggleSwitchDarkMode`.
### Como a Autenticação foi Implementada
 
1. **Cadastro (`cadastro.js`):** O usuário preenche nome, e-mail, sala e senha. Após validação local, a função `cadastrar` do contexto salva o objeto do usuário nas chaves `usuario` e `sessao` do AsyncStorage e atualiza `usuarioLogado` no estado, logando automaticamente.
2. **Login (`login.js`):** A função `login` recupera a chave `usuario` do AsyncStorage e compara e-mail (case-insensitive) e senha. Se correto, salva na chave `sessao` e atualiza o estado. Retorna `{ ok: true }` ou `{ ok: false, mensagem }` para a UI tratar com `Alert`.
3. **Restauração de sessão:** No `useEffect` de inicialização do `AppProvider`, a chave `sessao` é lida do AsyncStorage. Se existir, `usuarioLogado` é populado e o usuário não precisa fazer login novamente.
4. **Logout:** Remove a chave `sessao` do AsyncStorage e define `usuarioLogado` como `null`, o que dispara o `AuthGuard` a redirecionar para `/login`. -->

#### Hooks Utilizados:
* `useContext`: O principal pilar do app, usado para compartilhar o histórico de trocas e a lista de salas entre todas as telas de forma síncrona.
* `useState`: Utilizado para gerenciar dados locais, como os inputs do formulário e o controle de visibilidade (abrir/fechar) do Modal de histórico.
* `useRouter`: Hook nativo do expo-router utilizado para gerenciar a navegação programática entre as telas (ex: redirecionar após preencher o formulário).

#### Organização da Navegação:
* Utilizamos a navegação baseada em arquivos do Expo Router. A tela principal serve como aba central, enquanto o formulário, a visualização de salas e o histórico são rotas secundarias. Entretanto, o usuário consegue apenas acessar essas páginas se estiver cadastrado, ocorrendo essa verificação como forma de prevenção para o usuário não conseguir executar outras tarefas.
* Para a transmissão entre páginas, utilizamos o useContext, assim sendo possível passar as variáveis desejadas para todas as páginas.
* Perante a autenticação, se o usuário tentar passar para outras páginas sem realizar o cadastro, o aplicativo não permite essa mudança, apenas permitindo quando o usuário entra na sua conta. Além disso, no formulário ele apenas pode mudar a si mesmo de sala, ficando cadastrado seu nome e sala, evitando que outra pessoa altere um aluno aleatório de sala.
* O AsyncStorage foi implementado para salvar o histórico da mudança das salas, a quantidade de vagas presentes em cada uma e o usuário cadastrado. Cada um desses atributos foi salvo pelas respectivas chaves de acesso: historico, salas_data, sessao. O armazenamento de usuario é feito para validar as credenciais no login e confirmar se é permitido o cadastro/login da pessoa.
<br>

### 🚀 Próximos Passos
Pedimos para IA gerar algumas sugestões de melhora para o projeto futuramente.
1. Persistência de Dados Local: Implementação do AsyncStorage para garantir que o histórico de trocas e o estado das salas sejam mantidos mesmo após fechar o aplicativo.

2. Validação de Capacidade: Bloqueio inteligente no formulário para impedir trocas caso a sala de destino já tenha atingido o limite máximo de ocupação.

3. Filtros de Histórico: Adição de funcionalidades para buscar ou filtrar registros específicos dentro do Modal, facilitando a auditoria de trocas.

4. Sistema de Notificações: Avisos em tempo real (Push Notifications) para confirmar o sucesso da operação ou alertar sobre novas vagas disponíveis.

5. Exportação de Logs: Função para exportar o histórico de trocas em formato CSV ou PDF para fins administrativos acadêmicos.

<br>

### 👥 Contribuidores
563415 Fernando Caires Silva

563500 Guilherme Martins Rezende

563567 Raphael Mischiatti de Souza

Desenvolvido para o CP1 e aprimorado para a CP2 - Faculdade de Informática e Administração Paulista (FIAP).
