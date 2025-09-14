# ---- Estágio 1: Build (Construção) ----
# Usa uma imagem oficial do Node.js como base.
# 'alpine' é uma versão leve, ótima para builds.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o resto do código-fonte do projeto
COPY . .

# Executa o comando de build para gerar os arquivos estáticos na pasta /dist
RUN npm run build

# ---- Estágio 2: Production (Produção) ----
# Usa uma imagem oficial e leve do Nginx
FROM nginx:stable-alpine

# Copia o arquivo de configuração customizado do Nginx para dentro do contêiner
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos gerados no estágio de 'build' para a pasta do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx quando o contêiner for executado
CMD ["nginx", "-g", "daemon off;"]