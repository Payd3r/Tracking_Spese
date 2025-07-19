FROM node:18-alpine

WORKDIR /app

# Installa curl per health check
RUN apk add --no-cache curl

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze (incluso nodemon per sviluppo)
RUN npm install

# Copia il codice sorgente
COPY . .

# Espone la porta
EXPOSE 3001

# Comando di avvio con nodemon per hot reload
CMD ["npm", "run", "dev"] 