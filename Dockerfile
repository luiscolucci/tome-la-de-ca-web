# Dockerfile na raiz de /tome-la-de-ca-web

# --- ESTÁGIO 1: Build do Frontend ---
# Usa uma imagem Node para construir os arquivos estáticos do frontend
FROM node:20-alpine AS frontend-builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app/frontend

# Copia os arquivos de dependência e instala
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copia todo o código do frontend
COPY frontend/ ./

# Roda o comando de build para gerar a pasta /dist
RUN npm run build

# --- ESTÁGIO 2: Preparação do Backend ---
# Usa uma imagem Node para instalar as dependências de produção do backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copia os arquivos de dependência e instala somente o necessário para produção
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

# Copia o código do backend
COPY backend/ ./

# --- ESTÁGIO 3: Imagem Final ---
# Usa uma imagem Node.js limpa para a versão final
FROM node:20-alpine

WORKDIR /app

# Copia o backend (com node_modules) do estágio anterior
COPY --from=backend-builder /app/backend ./

# Copia os arquivos estáticos do frontend (a pasta 'dist') do estágio de build
# para uma pasta 'public' dentro do diretório do backend
COPY --from=frontend-builder /app/frontend/dist ./public

# Expõe a porta que o servidor Node.js irá escutar.
# O Cloud Run usa a variável de ambiente PORT, que por padrão é 8080.
EXPOSE 8080

# Comando para iniciar o servidor backend
# Ajuste o caminho se o seu arquivo de entrada for diferente (ex: "src/server.js")
CMD ["node", "src/index.js"]