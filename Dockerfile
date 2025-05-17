FROM node:20-alpine AS production
WORKDIR /app

RUN apk update && apk add --no-cache python3 make g++ libc6-compat

ENV PYTHON=python3

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/index.js"]
