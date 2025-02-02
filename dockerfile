# Usar uma imagem base do Node.js
FROM node:18

# Criar e definir o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que sua aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
