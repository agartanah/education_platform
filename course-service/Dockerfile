FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY course-service/package.json course-service/yarn.lock course-service/tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY shared ./shared

COPY course-service ./

RUN mkdir -p images/course videos/original/lesson videos/processed

RUN yarn global add ts-node tsconfig-paths

EXPOSE 3002

CMD ["yarn", "start"]