# --- Estágio 1: Construção (Build) ---
# Usamos uma imagem Node.js para construir os nossos ficheiros estáticos do React.
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os ficheiros de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código do frontend
COPY . .

# Executa o comando de build do Vite. Isto irá criar uma pasta `dist` com os ficheiros otimizados.
RUN npm run build

# --- Estágio 2: Serviço (Serve) ---
# Agora, usamos uma imagem muito leve de um servidor web (Nginx) para servir os ficheiros.
FROM nginx:stable-alpine

# Copia os ficheiros estáticos da pasta `dist` do estágio de construção para a pasta pública do Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o nosso ficheiro de configuração personalizado do Nginx.
# Este ficheiro é crucial para que o roteamento do React funcione corretamente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
