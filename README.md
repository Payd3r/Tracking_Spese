# 📊 Tracking Spese - Applicazione di Gestione Finanze Personali

Un'applicazione moderna per il tracking delle spese personali, costruita con React, TypeScript e PostgreSQL, containerizzata con Docker.

## 🚀 Deploy Rapido

### Con Docker Compose
```bash
# Configura le variabili
cp .env.example .env
# Modifica .env con i tuoi valori

# Deploy
docker-compose up -d
```

### Con GitHub Actions
Il progetto è configurato per deploy automatico con GitHub Actions.

## 🚀 Caratteristiche

- **📱 Interfaccia Moderna**: Design responsive con UI glassmorphism
- **💾 Database Reale**: PostgreSQL con dati persistenti
- **🔄 API REST**: Backend Express.js per operazioni CRUD
- **📈 Grafici Interattivi**: Visualizzazioni con Recharts
- **⚡ Performance**: React Query per caching e sincronizzazione
- **🐳 Containerizzato**: Ambiente Docker completo

## 🏗️ Architettura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   React + Vite  │◄──►│   Express.js    │◄──►│   PostgreSQL    │
│   Porta 3000    │    │   Porta 3001    │    │   Porta 5434    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisiti

- Docker Desktop
- Docker Compose
- Node.js 18+ (per sviluppo locale)

## 🚀 Avvio Rapido

### 1. Clona il Repository
```bash
git clone <repository-url>
cd Tracking_Spese
```

### 2. Avvia l'Ambiente Docker
```bash
# Avvio completo
docker-compose up --build -d

# Oppure usa lo script PowerShell
.\docker-scripts.ps1 start
```

### 3. Accedi all'Applicazione
- **Frontend**: http://localhost:3000 (con hot reload)
- **API**: http://localhost:4000 (con hot reload)
- **Database Admin**: http://localhost:8085

## 🛠️ Struttura del Progetto

```
Tracking_Spese/
├── api/                    # Backend API
│   ├── server.js          # Server Express.js
│   ├── package.json       # Dipendenze backend
│   └── Dockerfile         # Container backend
├── src/                   # Frontend React
│   ├── components/        # Componenti UI
│   ├── pages/            # Pagine dell'app
│   ├── lib/              # Utilità e API
│   └── hooks/            # Custom hooks
├── docker-compose.yml     # Orchestrazione container
├── Dockerfile            # Container frontend
├── nginx.conf            # Configurazione web server
├── init-db.sql           # Schema database
└── docker-scripts.ps1    # Script di gestione
```

## 🗄️ Database

### Tabelle Principali

#### `categories`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR) - Nome categoria
- `color` (VARCHAR) - Colore categoria
- `icon` (VARCHAR) - Icona categoria

#### `transactions`
- `id` (SERIAL PRIMARY KEY)
- `description` (VARCHAR) - Descrizione transazione
- `amount` (DECIMAL) - Importo
- `type` (VARCHAR) - 'income' o 'expense'
- `category_id` (INTEGER) - Riferimento categoria
- `date` (DATE) - Data transazione
- `notes` (TEXT) - Note aggiuntive

### Dati Iniziali
- 8 categorie predefinite (Alimentari, Trasporti, ecc.)
- Trigger automatici per `updated_at`
- Indici per performance

## 🔌 API Endpoints

### Categorie
- `GET /api/categories` - Lista categorie

### Transazioni
- `GET /api/transactions` - Lista transazioni
- `POST /api/transactions` - Crea transazione
- `PUT /api/transactions/:id` - Aggiorna transazione
- `DELETE /api/transactions/:id` - Elimina transazione

### Statistiche
- `GET /api/balance` - Saldo corrente e mensile
- `GET /api/statistics?period=month` - Statistiche per grafici

## 🎯 Funzionalità Frontend

### Dashboard Principale
- **Balance Card**: Saldo totale e variazione mensile
- **Quick Actions**: Aggiunta rapida transazioni
- **Transaction Chart**: Grafico interattivo spese/entrate
- **Recent Transactions**: Ultime 5 transazioni

### Gestione Transazioni
- ✅ Aggiunta nuove transazioni
- ✅ Modifica transazioni esistenti
- ✅ Eliminazione transazioni
- ✅ Categorizzazione automatica
- ✅ Validazione dati

### Visualizzazioni
- 📊 Grafici per periodo (giorno/settimana/mese/anno)
- 📈 Trend saldo nel tempo
- 🎨 Interfaccia glassmorphism moderna
- 🌙 Tema dinamico (chiaro/scuro/sistema)

## 🐳 Gestione Docker

### Comandi Utili

```powershell
# Controllo stato
.\docker-scripts.ps1 status

# Avvio ambiente
.\docker-scripts.ps1 start

# Arresto ambiente
.\docker-scripts.ps1 stop

# Visualizzazione log
.\docker-scripts.ps1 logs

# Backup database
.\docker-scripts.ps1 backup

# Pulizia completa (ATTENZIONE: cancella dati)
.\docker-scripts.ps1 clean
```

### Container Attivi
- **frontend**: React app con Vite (porta 3000, hot reload)
- **api**: Express.js API con Nodemon (porta 4000, hot reload)
- **postgres**: Database PostgreSQL (porta 5434)
- **adminer**: Gestione database (porta 8085)

## 🔧 Sviluppo

### Modalità Sviluppo con Docker (Raccomandato)

```bash
# Avvia ambiente completo con hot reload
docker-compose up --build -d

# Controlla log in tempo reale
docker-compose logs -f frontend
docker-compose logs -f api
```

### Modalità Sviluppo Locale

```bash
# Frontend
npm install
npm run dev

# Backend
cd api
npm install
npm run dev
```

### Variabili d'Ambiente

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

#### Backend (api/.env)
```env
DB_USER=postgres
DB_HOST=postgres
DB_NAME=tracking_spese
DB_PASSWORD=password123
DB_PORT=5432
```

## 📊 Credenziali Database

- **Host**: localhost (o postgres se da container)
- **Porta**: 5434
- **Database**: tracking_spese
- **Username**: postgres
- **Password**: password123

### Accesso Adminer
- **Sistema**: PostgreSQL
- **Server**: postgres
- **Username**: postgres
- **Password**: password123
- **Database**: tracking_spese

## 🚨 Risoluzione Problemi

### Porte Occupate
Se le porte sono già in uso, modifica `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Cambia porta frontend
  - "3002:3001"  # Cambia porta API
  - "5435:5432"  # Cambia porta database
```

### Container Non Si Avvia
```bash
# Rimuovi e ricrea
docker-compose down
docker-compose up --build

# Controlla log
docker-compose logs [service-name]
```

### Problemi Database
```bash
# Backup prima di modifiche
.\docker-scripts.ps1 backup

# Reset database
.\docker-scripts.ps1 clean
.\docker-scripts.ps1 start
```

## 🔒 Sicurezza

⚠️ **IMPORTANTE**: Le credenziali sono per sviluppo. Per produzione:

1. Usa variabili d'ambiente
2. Cambia password di default
3. Limita accesso alle porte
4. Configura SSL/TLS

## 📈 Roadmap

- [ ] Autenticazione utenti
- [ ] Multi-account
- [ ] Esportazione dati (CSV/PDF)
- [ ] Notifiche push
- [ ] Integrazione banche
- [ ] Budget e obiettivi
- [ ] App mobile

## 🤝 Contributi

1. Fork il progetto
2. Crea branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi `LICENSE` per dettagli.

## 📞 Supporto

Per problemi o domande:
1. Controlla la sezione "Risoluzione Problemi"
2. Verifica i log: `docker-compose logs`
3. Apri una issue su GitHub

---

**Buon tracking delle spese! 💰**
