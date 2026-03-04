#  Sistema de Gestão de Produtos

Este projeto foi desenvolvido como resolução de um Desafio Técnico. Trata-se de uma aplicação web responsiva para o cadastro, listagem e gerenciamento de produtos, construída com foco na Experiência do Usuário (UX), interface moderna e código limpo.

##  Sobre o Projeto

O sistema atende a todos os requisitos solicitados no escopo do desafio, além de implementar diversas funcionalidades extras (diferenciais) para aproximar a aplicação de um ambiente real de produção.

###  Requisitos Atendidos:
- [x] **Cadastro de Produtos:** Formulário contendo Nome, Descrição, Valor numérico e Disponibilidade (Sim/Não).
- [x] **Listagem Automática:** A listagem é atualizada e exibida automaticamente após um novo cadastro.
- [x] **Ordenação Inteligente:** Os produtos são exibidos ordenados pelo valor (do menor para o maior).
- [x] **Navegação Fluida:** Botão para alternar facilmente entre a tela de listagem e o cadastro de novos itens.

###  Grandes Diferenciais Implementados:
Além do básico, o sistema conta com:
- **Design Moderno (Glassmorphism):** Interface translúcida com efeito de vidro, animações suaves (`fade-in`) e total responsividade (Mobile First).
- **Persistência de Dados:** Uso do `localStorage` para que os produtos não sejam perdidos ao recarregar a página.
- **Upload de Imagens:** Suporte para upload de fotos (com validação de tamanho máximo de 2MB) e conversão para Base64.
- **CRUD Completo:** Opção de **Editar** produtos já existentes e **Excluir** itens.
- **Feedback Visual (UX):** Notificações flutuantes (Toasts) de sucesso/erro e Modal de confirmação para ações destrutivas (exclusão).
- **Tratamento de Exceções:** Uso de blocos `try/catch` para prevenir quebras no sistema caso o limite de armazenamento do navegador seja atingido.

##  Tecnologias Utilizadas

O projeto foi construído utilizando apenas tecnologias front-end nativas (Vanilla), demonstrando domínio dos fundamentos sem dependência de frameworks:
- **HTML5** (Semântico)
- **CSS3** (Variáveis, Flexbox, Animações, Media Queries)
- **JavaScript (ES6+)** (Manipulação de DOM, Arrays, Eventos, FileReader API)

## Como executar o projeto

Como a aplicação não exige um servidor back-end rodando, rodar o projeto é extremamente simples:

1. Faça o clone deste repositório:
   ```bash
   git clone [https://github.com/Pedro-Paulo-Mendes/Gerenciador-de-Produtos-Oak.git](https://github.com/Pedro-Paulo-Mendes/Gerenciador-de-Produtos-Oak.git)