# Etapa 1: Construir a aplicação
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instala apenas as dependências de produção para uma imagem mais leve
RUN npm ci --only=production
COPY . .

# Etapa 2: Criar a imagem final
FROM node:20-alpine
WORKDIR /app

# A CORREÇÃO: Define o ambiente para produção
# Isso irá instruir nosso código a usar as credenciais automáticas da nuvem
ENV NODE_ENV=production

COPY --from=builder /app ./

# O Cloud Run define a variável de ambiente PORT. Nosso servidor já a usa.
EXPOSE 8080

CMD ["node", "src/index.js"]

