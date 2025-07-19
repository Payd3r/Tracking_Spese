# Dockerfile per l'applicazione React con Vite - Produzione
FROM node:18-alpine AS base

# Installa le dipendenze necessarie
RUN apk add --no-cache libc6-compat

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package*.json ./

# Stage di build
FROM base AS builder

# Installa tutte le dipendenze (inclusi devDependencies)
RUN npm ci

# Copia il codice sorgente
COPY . .

# Build dell'applicazione
RUN npm run build

# Stage di produzione
FROM nginx:alpine AS runner

# Installa curl per health check
RUN apk add --no-cache curl

# Copia i file buildati
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/nginx.conf

# Crea directory per i log
RUN mkdir -p /var/log/nginx

# Espone la porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando di avvio
CMD ["nginx", "-g", "daemon off;"] 