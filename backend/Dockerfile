# Etapa 1: Construir a aplicação
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instala apenas as dependências de produção para uma imagem mais leve
RUN npm ci --only=production
COPY . .

# Etapa 2: Criar a imagem final
FROM node:18-alpine
WORKDIR /app

# A MELHORIA: Define o ambiente para produção
# Isto irá instruir o nosso código a usar as credenciais da nuvem
ENV NODE_ENV=production

COPY --from=builder /app ./

# O Cloud Run define a variável de ambiente PORT. O nosso servidor já a usa.
EXPOSE 8080

CMD ["node", "src/index.js"]

