# src/caterchef-frontend/Dockerfile

# --- ETAPA 1: Construcción (CAMBIADO Node 18 por Node 20) ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copia los archivos de configuración de paquetes
COPY package*.json ./

# Instala las dependencias de Node
RUN npm ci

# Copia todo el código del frontend
COPY . .

# Desactiva la telemetría de Next.js durante la compilación
ENV NEXT_TELEMETRY_DISABLED=1

# Compila la aplicación de Next.js para producción
RUN npm run build


# --- ETAPA 2: Ejecución (CAMBIADO Node 18 por Node 20) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copia los archivos necesarios desde la etapa de compilación
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expone el puerto por defecto de Next.js
EXPOSE 3000

# Arranca el servidor de producción de Next.js
CMD ["npm", "run", "start"]