# 🚀 Node.js + MongoDB + Mongoose

Этот проект использует Node.js, MongoDB и Mongoose. Ниже приведены инструкции по установке и запуску проекта.

## 📌 Требования

- Node.js v20.12.2

- Yarn 1.22.22

- MongoDB 8.0.4

## 🔽 Установка и запуск

### 1️⃣ Клонирование репозитория

```
git clone https://github.com/education_platform.git
cd education_platform
```

### 2️⃣ Установка Yarn (если не установлен)

```
npm install -g yarn
```

Проверить версию:

```
yarn -v
```

### 3️⃣ Установка зависимостей

```
yarn install
```

### 4️⃣ Создание файла .env

Файл .env не передается через Git, поэтому его нужно создать вручную:

```
cp .env.example .env
```

После этого откройте .env и укажите строку подключения к базе данных:

```
MONGO_URI=mongodb://localhost:27017/mydatabase
PORT=3000
```

### 5️⃣ Запуск MongoDB

Если используется локальная MongoDB:

```
mongod --dbpath "C:\path\to\data\db"
```

Или через команду

```
mongosh
```

## 📌 Для запуска (с Nodemon):

```
yarn dev
```

# ✅ Готово!

## Теперь проект работает! 🎉
