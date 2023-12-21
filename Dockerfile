FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json .
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 4006
