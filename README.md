# 🚀 Node.js + MongoDB + Mongoose + RabbitMQ + Docker

# Education Platform

Образовательная платформа, построенная на микросервисной архитектуре с использованием Node.js, MongoDB, RabbitMQ и Docker.

## Архитектура системы

Проект состоит из следующих компонентов:

- **API Gateway** (порт 3000) - точка входа для всех запросов
- **User Service** (порт 3001) - управление пользователями и аутентификация
- **Course Service** (порт 3002) - управление курсами и учебными материалами
- **MongoDB** (порт 27017) - база данных
- **RabbitMQ** (порт 5672, управление 15672) - система обмена сообщениями

## Предварительные требования

Убедитесь, что у вас установлены:

- [Docker](https://docs.docker.com/get-docker/) версии 20.10 или выше
- [Docker Compose](https://docs.docker.com/compose/install/) версии 1.29 или выше

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd education-platform
```

### 2. Запуск проекта

```bash
# Запуск всех сервисов
docker-compose up -d

# Или с логами в реальном времени
docker-compose up
```

### 3. Проверка статуса сервисов

```bash
# Просмотр статуса контейнеров
docker-compose ps

# Просмотр логов конкретного сервиса
docker-compose logs user-service
docker-compose logs course-service
docker-compose logs api-gateway
```

## Доступные сервисы

После успешного запуска будут доступны:

| Сервис | URL | Описание |
|--------|-----|----------|
| API Gateway | http://localhost:3000 | Основная точка входа |
| User Service | http://localhost:3001 | Сервис пользователей |
| Course Service | http://localhost:3002 | Сервис курсов |
| RabbitMQ Management | http://localhost:15672 | Панель управления RabbitMQ |
| MongoDB | mongodb://localhost:27017 | База данных |
