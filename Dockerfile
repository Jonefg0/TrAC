FROM node:14-alpine

WORKDIR /home/trac

RUN npm install -g pnpm@5.18.3

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

EXPOSE 3000

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
