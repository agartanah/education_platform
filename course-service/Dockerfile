FROM node:18-alpine

# Устанавливаем ffmpeg для обработки видео
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Копируем package.json и yarn.lock для кэширования зависимостей
COPY course-service/package.json course-service/yarn.lock course-service/tsconfig.json ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем shared директорию
COPY shared ./shared

# Копируем исходный код сервиса
COPY course-service ./

# Создаем необходимые директории для файлов
RUN mkdir -p images/course videos/original/lesson videos/processed

# Устанавливаем глобально ts-node и tsconfig-paths
RUN yarn global add ts-node tsconfig-paths

EXPOSE 3002

CMD ["yarn", "start"]