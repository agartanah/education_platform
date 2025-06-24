FROM node:18-alpine

WORKDIR /app

# Копируем package.json для кэширования зависимостей
COPY user-service/package.json user-service/yarn.lock user-service/tsconfig.json ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем shared директорию
COPY shared ./shared

# Копируем исходный код сервиса
COPY user-service ./

# Устанавливаем глобально ts-node и tsconfig-paths
RUN yarn global add ts-node tsconfig-paths

EXPOSE 3001

CMD ["yarn", "start"]