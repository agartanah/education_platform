FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn global add ts-node tsconfig-paths

EXPOSE 3000

CMD ["yarn", "start"]