# Etapa final
# 1. Usar uma imagem base oficial do Node.js
FROM node:20-alpine

# 2. Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Copiar os arquivos de dependências
COPY package*.json ./

# 4. Instalar as dependências
RUN npm install --only=production

# 5. Copiar todo o resto do código da sua aplicação (incluindo o server.js já modificado)
COPY . .

# (Opcional, mas boa prática) Expor a porta que o contêiner usará.
# O Cloud Run ignora isso e usa a variável PORT, mas é bom para documentação.
EXPOSE 8080

# 6. Comando final para iniciar sua aplicação quando o contêiner for executado
CMD [ "npm", "start" ]
