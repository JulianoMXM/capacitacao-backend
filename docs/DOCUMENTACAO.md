# Blog API

API RESTfull desenvolvida para um sistema de blog. O projeto permite cadastro de usuário, gerenciamento de posts e de comentários com autenticação JWT.

# Funcionalidades

- **Usuários**
  - Cadastro (com Hash de senha)
  - Busca dos dados do usuário
  - Edição de perfil (nome, email, ou senha)
  - Exclusão de conta

- **Autenticação**
  - Login com retorno de JWT

- **Post**
  - Criação de Post 
  - Listagem de todos os posts (paginação)
  - Listagem de todos os posts do usuário (paginação)
  - Busca por um único post
  - Busca por um único post do usuário
  - Atualização de post do usuário
  - Remoção de post do usuário

- **Comentários**
  - Criação de comentário
  - Listagem de todos os comentários de um post (paginação)
  - Atualização de um comentário do usuário
  - Remoção de um comentário do usuário

# Requisitos
  - NestJS
  - Postgres

# 1. Passo

```bash
git clone https://github.com/JulianoMXM/capacitacao-backend.git
```

# 2. Passo
```npm install```

# 3. Passo

Criar um arquivo .env na raiz da pasta CAPACITACAO-BACKEND e preencher seguindo o modelo:

DB_HOST=seu_host
DB_PORT=sua_porta
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_NAME=seu_nome_do_banco
JWT_SECRET=sua_senha_secreta

# 4. Passo

Inicie o servidor utilizando npm run start:dev

# Rotas de Usuário

- POST -> user
  - Cria um novo usuário, rota pública

- GET -> user/me
  - Busca os dados do usuário, rota privada

- PATCH -> user/me
  - Atualiza email ou nome do usuário, rota privada

- PATCH -> user/me/password
  - Atualiza senha do usuário, rota privada

- DELETE -> user/me
  - Exclui o usuário, rota privada

# Rota de Autenticação

- POST -> auth/login
  - Autentica o usuário e retorna JWT, rota pública

# Rotas de Post

- POST -> post/me
  - Cria um novo post, rota privada

- GET -> post
  - Busca todos os posts (paginação), rota pública
  - Permite o uso de ?page e ?limit como query params

- GET -> post/:slug
  - Busca um post específico, rota pública

- GET -> post/me
  - Busca todos os posts do usuário logado (paginação), rota privada
  - Permite o uso de ?page e ?limit como query params

- GET -> post/me/:slug
  - Busca um post específico do usuário logado, rota privada

- PATCH -> post/me/:id
  - Atualiza um post específico do usuário, rota privada

- DELETE -> post/me/:id
  - Exclui um post específico do usuário, rota privada

# Rotas de Comentário

  - POST -> comment/me
    - Cria um novo comentário, rota privada

  - GET -> comment/me/:id
    - Busca todos os comentários de um post (paginação), rota privada
    - Permite o uso de ?page e ?limit como query params

  - PATCH -> comment/me/:id 
    - Atualiza um comentário específico do usuário, rota privada

  - DELETE -> comment/me
    - Exclui um comentário específico do usuário
