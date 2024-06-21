# Nodejs
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Need to dependencies
COPY pnpm-lock.yaml package.json .npmrc .sentryclirc ./

# Dependencies
RUN npm install -g pnpm && pnpm install

# Rest files
COPY . .

# Construye la aplicación Next.js
RUN pnpm run build

# Expón el puerto en el que se ejecutará el servidor de Next.js
EXPOSE 3000

# Comando para iniciar el servidor de Next.js en modo producción
CMD ["pnpm", "start"]
