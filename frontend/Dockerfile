# Etapa 1: Construir a aplicação React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine
RUN apk add --no-cache gettext dos2unix

# Cache buster - 30/08/2025 # <--- ADICIONE ESTA LINHA DE COMENTÁRIO

# <<< CORRIGIDO: O caminho foi ajustado para corresponder ao script entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html
COPY entrypoint.sh /docker-entrypoint.sh

RUN dos2unix /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]