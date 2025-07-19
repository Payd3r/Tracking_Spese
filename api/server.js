import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'tracking_spese',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Routes

// GET /api/categories - Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/categories - Create new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    
    const result = await pool.query(`
      INSERT INTO categories (name, icon, color)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, icon, color]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/categories/:id - Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    
    const result = await pool.query(`
      UPDATE categories 
      SET name = $1, icon = $2, color = $3
      WHERE id = $4
      RETURNING *
    `, [name, icon, color, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/categories/:id - Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/transactions - Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.description,
        t.amount,
        t.type,
        t.date,
        t.notes,
        t.created_at,
        t.updated_at,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC, t.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/transactions - Create new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, type, category_id, date, notes } = req.body;
    
    const result = await pool.query(`
      INSERT INTO transactions (description, amount, type, category_id, date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [description, amount, type, category_id, date, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/transactions/:id - Update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category_id, date, notes } = req.body;
    
    const result = await pool.query(`
      UPDATE transactions 
      SET description = $1, amount = $2, type = $3, category_id = $4, date = $5, notes = $6
      WHERE id = $7
      RETURNING *
    `, [description, amount, type, category_id, date, notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/transactions/:id - Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/balance - Get current balance and statistics
app.get('/api/balance', async (req, res) => {
  try {
    // Get total balance
    const balanceResult = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses
      FROM transactions
    `);
    
    const { total_income, total_expenses } = balanceResult.rows[0];
    const current_balance = total_income - total_expenses;
    
    // Get monthly change
    const monthlyResult = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as monthly_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as monthly_expenses
      FROM transactions
      WHERE date >= DATE_TRUNC('month', CURRENT_DATE)
    `);
    
    const { monthly_income, monthly_expenses } = monthlyResult.rows[0];
    const monthly_change = monthly_income - monthly_expenses;
    
    res.json({
      current_balance: parseFloat(current_balance),
      monthly_change: parseFloat(monthly_change),
      total_income: parseFloat(total_income),
      total_expenses: parseFloat(total_expenses)
    });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/statistics - Get transaction statistics for charts
app.get('/api/statistics', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter;
    switch (period) {
      case 'day':
        dateFilter = "date >= CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "date >= DATE_TRUNC('week', CURRENT_DATE)";
        break;
      case 'month':
        dateFilter = "date >= DATE_TRUNC('month', CURRENT_DATE)";
        break;
      case 'year':
        dateFilter = "date >= DATE_TRUNC('year', CURRENT_DATE)";
        break;
      default:
        dateFilter = "date >= DATE_TRUNC('month', CURRENT_DATE)";
    }
    
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('day', date) as date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
      FROM transactions
      WHERE ${dateFilter}
      GROUP BY DATE_TRUNC('day', date)
      ORDER BY date
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 