FROM node:18-alpine

WORKDIR /app

COPY user-service/package.json user-service/yarn.lock user-service/tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY shared ./shared

COPY user-service ./

RUN yarn global add ts-node tsconfig-paths

EXPOSE 3001

CMD ["yarn", "start"]