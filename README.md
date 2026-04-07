# Task Manager

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Полностековый менеджер задач с JWT-авторизацией, пагинацией, сортировкой и ролями (пользователь/администратор). Бэкенд на Express 5 + Prisma, фронтенд на React 18 + Redux Toolkit, база данных PostgreSQL в Docker.

---

## Демо

**[Открыть приложение](https://task-manager-copy-production.up.railway.app/)**

---

## Возможности

- Создание задач с валидацией (имя, email, текст)
- Пагинация (3 задачи на страницу) и сортировка по любому полю
- JWT-авторизация администратора
- Редактирование задач администратором (текст, статус)
- Отметка "отредактировано администратором" при изменении текста
- Защита от XSS-атак
- Синхронизация logout между вкладками браузера
- Docker Compose для локальной базы данных

---

## Технологический стек

### Бэкенд

| Технология | Назначение |
|---|---|
| **Express 5** | HTTP-сервер и API |
| **Prisma ORM** | Работа с базой данных |
| **PostgreSQL 15** | Реляционная БД |
| **JWT (jsonwebtoken)** | Авторизация |
| **express-validator** | Валидация запросов |
| **Docker Compose** | Контейнеризация БД |

### Фронтенд

| Технология | Назначение |
|---|---|
| **React 18** | UI-компоненты |
| **Redux Toolkit** | Управление состоянием |
| **React Router 6** | Маршрутизация |
| **React Hook Form + Yup** | Формы и валидация |
| **Axios** | HTTP-клиент |
| **Vite** | Сборка и dev-сервер |

---

## Быстрый старт

### Предварительные требования

- Node.js 18+
- Docker и Docker Compose (для PostgreSQL)

### 1. Клонирование и настройка

```bash
git clone https://github.com/PavelHopson/task-manager.git
cd task-manager
```

Скопируйте `.env.example` и настройте переменные:

```bash
cp .env.example backend/.env
```

### 2. Запуск базы данных

```bash
docker compose up -d
```

### 3. Запуск бэкенда

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

Сервер запустится на http://localhost:4000

### 4. Запуск фронтенда

```bash
cd frontend
npm install
npm run dev
```

Фронтенд запустится на http://localhost:5173

---

## Структура проекта

```
task-manager/
├── backend/
│   ├── src/
│   │   └── index.js          # Express-сервер, маршруты, middleware
│   ├── prisma/
│   │   └── schema.prisma     # Модель данных
│   └── package.json
├── frontend/
│   ├── src/                  # React-компоненты, Redux, роутинг
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml        # PostgreSQL в контейнере
├── .env.example              # Пример переменных окружения
└── LICENSE
```

---

## Деплой

| Сервис | Платформа |
|---|---|
| Бэкенд | Railway (Node.js) |
| Фронтенд | Vercel (React/Vite) |
| База данных | Railway (PostgreSQL) |

---

## Скриншоты

<!-- TODO: добавить скриншоты -->

---

## Лицензия

Проект распространяется под лицензией MIT. Подробнее см. [LICENSE](LICENSE).

## Автор

**Павел Хопсон** — [GitHub](https://github.com/PavelHopson)
