# Jaguar_Loca — Resumo do Projeto

Este repositório contém uma aplicação full‑stack de exemplo (Vite + React no frontend, Express + Prisma + PostgreSQL no backend) para uma locadora de veículos chamada **JaguarLoca**. Abaixo segue um resumo do que foi implementado, estrutura do projeto, endpoints e instruções rápidas para rodar localmente.

**Data:** 27 de novembro de 2025

---

**Visão geral (o que foi feito)**
- Frontend em React (Vite) com páginas de login, registro e painel de administração.
- Backend em Express com integração com Prisma ORM e PostgreSQL.
- Fluxo de autenticação simples: registro/login de usuários, token simples armazenado no `localStorage`.
- Componente de perfil do usuário (`Profile_user`) exibido no `Header` quando usuário logado; menu com opções para alterar e-mail, senha, deletar conta e logout.
- Painel de administrador (`/admin`) que permite cadastrar veículos (`Veiculo`) e deletar usuários registrados. Autenticação de admin implementada localmente (credentials fixas para dev).
- Cards de veículos extraídos para componente `Card` com modal de reserva que abriu junto ao card (melhor encapsulamento).
- Uso do Prisma para persistência: modelos `Usuario` e `Veiculo` no `schema.prisma`.

---

**Estrutura principal do repositório**
- `frontend/` — código do cliente (Vite + React)
  - `components/` — `header`, `footer`, `profile_user`, `profile_admin`, `card`, etc.
  - `pages/` — `Login.jsx`, `Register.jsx`, `admin/Admin.jsx`, etc.
  - `main.jsx` — entry do Vite
- `backend/` — servidor Express + Prisma
  - `src/routes` — rotas (`auth.routes.js`, `admin.routes.js`)
  - `src/controllers` — controllers para auth e admin
  - `src/services` — lógica de negócio (auth.service, admin.service)
  - `prisma/schema.prisma` — modelos do banco (Usuario, Veiculo)
- `package.json` (raiz) — scripts para rodar frontend e backend em conjunto, e scripts do Prisma

---

**Principais scripts (raiz)**
- `npm run dev` — roda backend (nodemon) e frontend (Vite) em paralelo
- `npm run start` — inicia apenas o backend (`node backend/index.js`)
- `npm run prisma:generate` — `prisma generate` apontando para `backend/prisma/schema.prisma`
- `npm run prisma:migrate` — aplica migrations (use com cuidado)
- `npm run prisma:studio` — abre Prisma Studio (script já aponta para `backend/prisma/schema.prisma`)

---

**Como rodar localmente (rápido)**
1. Instale dependências:
```powershell
npm install
```
2. Gere o Prisma Client e aplique a migration (quando necessário):
```powershell
npm run prisma:generate
npm run prisma:migrate
```
3. Rode a aplicação em modo desenvolvimento:
```powershell
npm run dev
```
4. Acesse o frontend: `http://localhost:5173` (porta Vite) e o backend em `http://localhost:4000`.

Observação: se quiser abrir o Prisma Studio diretamente use:
```powershell
npx prisma studio --schema ./backend/prisma/schema.prisma
```

---

**Endpoints principais (resumo)**
- `POST /auth/registro` — cria usuário (nome, cpf, email, senha)
- `POST /auth/login` — autentica usuário e retorna token simples
- `PUT /auth/email` — altera e-mail (autenticado)
- `PUT /auth/password` — altera senha (autenticado)
- `DELETE /auth/account` — deleta conta (autenticado)

Admin (requer header `Authorization: Bearer admin-token` para autenticação de dev):
- `POST /admin/vehicles` — cadastra veículo (`nome`, `cadeiras`, `acessorios`)
- `GET /admin/users` — lista usuários (id, nome, email, cpf)
- `DELETE /admin/users/:id` — deleta usuário por id

---

**Frontend — principais comportamentos**
- `Header` detecta `localStorage` e mostra `Profile_user` (usuário) ou `Profile_admin` (quando `loginType=admin`).
- Login de administrador (desenvolvimento):
  - Email: `robertocrfilho1996@gmail.com`
  - Senha: `123456`
  - Código de administrador: `1234`
  - Ao logar como admin, o app guarda `token=admin-token` e `loginType=admin` no `localStorage`.
- `Card` componente: cada card gerencia seu próprio modal de reserva (bloqueio de scroll, ESC para fechar, backdrop, ids únicos por card).

---

**Banco de dados (Prisma)**
- Modelos implementados: `Usuario`, `Veiculo`.
- String de conexão configurada em `.env` (root) via `DATABASE_URL`.

---

**Observações de segurança**
- A autenticação de administrador atual é apenas para desenvolvimento (credenciais fixas e token simples). Não é segura para produção. Para produção recomenda-se:
  - cadastrar administradores no banco com roles/privilegios,
  - usar JWTs com expiração e refresh tokens,
  - proteger rotas críticas no backend com autenticação e autorização robusta.

---

**Próximos passos / melhorias sugeridas**
- Implementar autenticação real de administradores (usuário admin no DB + JWT).
- Adicionar upload de imagens para veículos e validações de formulário mais rigorosas.
- Transformar modal em componente reutilizável ou centralizar com Context para evitar múltiplos modais no DOM.
- Melhorar testes (unitários e E2E) e adicionar CI.

---

Se quiser, eu edito esse `REDME.md` com imagens, diagramas ou comandos específicos do seu ambiente (por exemplo paths do PostgreSQL ou instruções para Windows/PowerShell). Quer que eu adicione instruções para criar a database no PostgreSQL ou gerar o arquivo `.env` com valores de exemplo? 
