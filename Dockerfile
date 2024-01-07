FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package*.json .
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Create the script file
# Up the migration and start the server
RUN echo "#!/bin/sh" > /app/start.sh
RUN echo "set -e" >> /app/start.sh
RUN echo "npx mikro-orm migration:up" >> /app/start.sh
RUN echo "npm run start:prod" >> /app/start.sh
RUN chmod +x /app/start.sh

ENV DATABASE_URL=
ENV REDIS_URL=
ENV GOOGLE_MAILER_CLIENT_ID=
ENV GOOGLE_MAILER_CLIENT_SECRET=
ENV GOOGLE_MAILER_REFRESH_TOKEN=
ENV ADMIN_EMAIL_ADDRESS=
ENV JWT_PRIVATE_KEY=
ENV JWT_PUBLIC_KEY=


EXPOSE 4006
CMD ["/app/start.sh"]
