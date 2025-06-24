FROM node:18-alpine

WORKDIR /app

# Копируем package.json и yarn.lock для кэширования зависимостей
COPY package.json yarn.lock tsconfig.json ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходный код
COPY . .

# Компилируем TypeScript
RUN yarn build

# Команда по умолчанию - просто держим контейнер запущенным
CMD ["tail", "-f", "/dev/null"]