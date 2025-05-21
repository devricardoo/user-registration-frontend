# Front-end de Cadastro de Usuários

Este é o front-end de um sistema de cadastro de usuários. Ele foi desenvolvido para permitir que os usuários se cadastrem, editem e visualizem suas informações. O front-end foi construído com as tecnologias mais adequadas para criar uma experiência de usuário rápida e intuitiva.

## Funcionalidades

- **Cadastro de novos usuários**: O formulário coleta informações como nome, e-mail, CPF, senha e Endereço, e envia para o back-end.
- **Edição de dados**: Os usuários que tem a permissão de ADM podem editar as informações do registro.
- **Detalhes de informações**: Usuários como ADM e USERS podem visualizar os dados que estão armazenados no sistema.
- **Exlusão de informações**: Usuários com a permissão de ADM podem exlcuir os dados que estão armazenados no sistema.

## Tecnologias Utilizadas

- **Vue 3**: Framework JavaScript para construção da interface de usuário.
- **Vuetify**: Framework de UI baseado em Material Design, usado para criar a interface responsiva e interativa.
- **Axios**: Biblioteca para realizar requisições HTTP para o back-end.
- **Vue Router**: Para navegação entre páginas da aplicação.
- **Vuex** (se for o caso): Para gerenciar o estado global da aplicação, se necessário.

## Instalação

### 1. Clone o Repositório

Clone o repositório para o seu ambiente local:

```bash
git clone https://github.com/devricardoo/user-registration-frontend.git
cd user-registration-frontend
```

### 2. Detalhes importantes

Como mencionado no README do Back-end:
Foi adicionado a parte de login com token, onde é necessário fazer login.

Segue abaixo um usuário padrão que tem a permissão de ADM:

- ricardo@gmail.com
- 123456 (password)
