# Piratas SIS - Sistema Interno Simplificado

**Piratas SIS** é um sistema de desktop minimalista, desenvolvido para gestão interna de pequenos estabelecimentos, como lanchonetes e restaurantes.  
Ele foi criado para ser **leve, rápido e funcionar offline**, focando em tarefas essenciais do dia a dia: cadastro de funcionários, lançamento de contas e registro de entregas.

O sistema foi construído com tecnologias modernas, utilizando **Electron** para o encapsulamento desktop e **React com Vite** para a interface de usuário.

---

## ✨ Funcionalidades Principais

- **Widget Flutuante**  
  O sistema inicia como um widget discreto no canto da tela.  
  Um clique expande a janela para acesso rápido.

- **Cadastro de Funcionários**  
  Registre membros da equipe com nome e função (Caixa, Garçom, Cozinha, Motoboy).

- **Lançamento de Contas**  
  Associe despesas e produtos consumidos a um funcionário específico.

- **Registro de Entregas**  
  Cadastre o número de entregas, gorjetas e descontos para cada motoboy.

- **Geração de Relatórios**  
  - Imprima relatórios de contas individuais por funcionário.  
  - Imprima relatórios de entregas por motoboy.  
  - Gere um fechamento consolidado por período.

- **Armazenamento Local**  
  Todos os dados são salvos localmente em um arquivo JSON, garantindo funcionamento **100% offline**.

---

## 🚀 Tecnologias Utilizadas

- [Electron](https://www.electronjs.org/) – Framework para criar aplicações desktop com JS, HTML e CSS.  
- [React](https://react.dev/) – Biblioteca para construção da interface de usuário.  
- [Vite](https://vitejs.dev/) – Ferramenta de build moderna e ultrarrápida.  
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática para JavaScript.  
- [Electron Builder](https://www.electron.build/) – Empacotamento e distribuição da aplicação.

---

## ⚙️ Como Executar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) instalado na máquina.

### 2. Clone o repositório
```bash
git clone[(https://github.com/CesarTurmina/piratas-sis.git)]
cd piratas-sis
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Rode em modo de desenvolvimento
```bash
npm run dev
```

## 📦 Como Compilar (Gerar o .exe)

Para gerar um **executável portátil** do programa, utilize o comando:

```bash
npm run dist
```

Após a conclusão, a versão compilada (por exemplo, **Piratas SIS 0.0.1.exe**) estará disponível na pasta **dist**.


## 📂 Estrutura do Projeto

```bash
/piratas-sis
├── /dist/           # Arquivos de build gerados (ignorar no Git)
├── /electron/       # Código do processo principal do Electron
│   ├── main.js      # Ponto de entrada, cria a janela e gerencia eventos
│   ├── preload.cjs  # Script que liga frontend ↔ backend de forma segura
│   └── store.js     # Lógica de armazenamento local (JSON)
├── /public/         # Arquivos estáticos (ícones, logo)
├── /src/            # Código-fonte do frontend (React + Vite)
│   ├── /assets/     # Imagens e outros recursos
│   ├── /components/ # Componentes React (Contas, Entregas, Relatórios)
│   ├── /utils/      # Utilitário para ajustes de data-hora
│   └── App.tsx      # Componente principal da aplicação
├── .gitignore       # Regras de exclusão do Git
├── package.json     # Dependências e scripts do projeto
└── README.md        # Documentação do projeto
```

## ⚖️ Licença

Este projeto é **open source**.  

Sinta-se à vontade para usar, modificar e distribuir conforme necessário.
