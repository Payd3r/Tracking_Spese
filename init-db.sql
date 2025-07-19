-- Script di inizializzazione del database per Tracking Spese

-- Crea le tabelle necessarie per l'applicazione

-- Tabella delle categorie
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella delle transazioni
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Inserisci alcune categorie di default
INSERT INTO categories (name, color, icon) VALUES
    ('Alimentari', '#EF4444', 'shopping-cart'),
    ('Trasporti', '#3B82F6', 'car'),
    ('Intrattenimento', '#8B5CF6', 'gamepad-2'),
    ('Salute', '#10B981', 'heart'),
    ('Casa', '#F59E0B', 'home'),
    ('Abbonamenti', '#EC4899', 'repeat'),
    ('Shopping', '#06B6D4', 'shopping-bag'),
    ('Altro', '#6B7280', 'more-horizontal')
ON CONFLICT (name) DO NOTHING;



-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Crea una funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crea trigger per aggiornare automaticamente updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

 