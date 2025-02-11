# Usar Node.js 22 como base
FROM node:22

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código para dentro do contêiner
COPY . .

# Expor a porta do Vite
EXPOSE 5173

# Comando padrão ao iniciar o contêiner
CMD ["npm", "run", "dev", "--", "--host"]
