const express = require('express');
const { Pool } = require('pg');
const { Signer } = require('@aws-sdk/rds-signer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── SSL certificate validation ──────────────────────────────────────────────
const sslCertPath = path.resolve(__dirname, process.env.SSL_CERT_PATH || './global-bundle.pem');
let sslConfig = false;

if (fs.existsSync(sslCertPath)) {
  console.log(`🔒 SSL certificate bundle loaded: ${sslCertPath}`);
  sslConfig = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(sslCertPath).toString(),
  };
} else {
  console.warn(`⚠️ Warning: SSL certificate bundle not found at ${sslCertPath}. Connecting without verify-full.`);
}

// ─── pg client initialization with dynamic password ─────────────────────────
const pool = new Pool({
  host: process.env.RDSHOST,
  user: process.env.RDSUSER,
  database: process.env.RDSDB,
  port: parseInt(process.env.RDSPORT || '5432'),
  ssl: sslConfig,
  password: async () => {
    if (process.env.USE_IAM_AUTH === 'true') {
      console.log('🔑 Generating AWS RDS IAM authentication token...');
      try {
        const signer = new Signer({
          hostname: process.env.RDSHOST,
          port: parseInt(process.env.RDSPORT || '5432'),
          username: process.env.RDSUSER,
          region: process.env.AWS_REGION || 'ap-south-2',
        });
        const token = await signer.getAuthToken();
        console.log('✅ AWS RDS IAM authentication token generated successfully.');
        return token;
      } catch (err) {
        console.error('❌ Failed to generate AWS RDS IAM token:', err.message);
        throw err;
      }
    } else {
      return process.env.RDSPASSWORD;
    }
  },
});

// ─── Database Setup & Seeding on startup ─────────────────────────────────────
async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔌 Connected to AWS RDS PostgreSQL database.');

    // 1. Create Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.products (
        id text PRIMARY KEY,
        title text NOT null,
        description text,
        category text,
        brand text,
        condition text,
        rent_per_day numeric NOT null,
        security_deposit numeric DEFAULT 500,
        price numeric,
        address text,
        city text,
        rating numeric DEFAULT 5.0,
        reviews_count integer DEFAULT 0,
        availability text DEFAULT 'Available',
        trust_score integer DEFAULT 90,
        scam_risk text DEFAULT 'Low',
        scam_reasons text[],
        owner jsonb,
        serial_number text,
        invoice_verified boolean DEFAULT false,
        rent_history jsonb DEFAULT '[]'::jsonb,
        gradient_theme text,
        specifications jsonb DEFAULT '[]'::jsonb,
        condition_report text[] DEFAULT '{}'::text[],
        image text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT null
      )
    `);
    console.log('✨ Products table verified/created.');

    // 2. Create Applications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.applications (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id text NOT null,
        product_id text NOT null,
        product_title text NOT null,
        status text DEFAULT 'Under AI Review',
        date date DEFAULT current_date,
        total_amount text,
        deposit text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT null
      )
    `);
    console.log('✨ Applications table verified/created.');

    // 3. Seed Products if empty
    const checkRes = await client.query('SELECT count(*) FROM public.products');
    const count = parseInt(checkRes.rows[0].count);
    if (count === 0) {
      console.log('🌱 Seeding products from mockProducts.json...');
      const seedFile = path.resolve(__dirname, './mockProducts.json');
      if (fs.existsSync(seedFile)) {
        const mockProducts = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
        for (const p of mockProducts) {
          await client.query(`
            INSERT INTO public.products (
              id, title, description, category, brand, condition, rent_per_day, security_deposit, price,
              address, city, rating, reviews_count, availability, trust_score, scam_risk, scam_reasons,
              owner, serial_number, invoice_verified, rent_history, gradient_theme, specifications, condition_report, image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
          `, [
            p.id, p.title, p.description, p.category, p.brand, p.condition, p.rentPerDay, p.securityDeposit, p.price,
            p.address, p.city, p.rating, p.reviewsCount, p.availability, p.trustScore, p.scamRisk, p.scamReasons,
            JSON.stringify(p.owner), p.serialNumber, p.invoiceVerified, JSON.stringify(p.rentHistory), p.gradientTheme,
            JSON.stringify(p.specifications), p.conditionReport, p.image
          ]);
        }
        console.log(`✅ Successfully seeded ${mockProducts.length} products.`);
      } else {
        console.error(`❌ Mock products file not found at ${seedFile}. Seeding skipped.`);
      }
    } else {
      console.log(`ℹ️ Products table already has ${count} records. Seeding skipped.`);
    }

  } catch (err) {
    console.error('❌ Database initialization error:', err);
  } finally {
    if (client) client.release();
  }
}

// Run DB setup
initializeDatabase();

// ─── API Endpoints ───────────────────────────────────────────────────────────

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.products ORDER BY created_at DESC');
    // Map database snake_case fields back to frontend camelCase
    const products = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      brand: row.brand,
      condition: row.condition,
      rentPerDay: Number(row.rent_per_day),
      securityDeposit: Number(row.security_deposit),
      price: Number(row.price),
      address: row.address,
      city: row.city,
      rating: Number(row.rating),
      reviewsCount: Number(row.reviews_count),
      availability: row.availability,
      trustScore: Number(row.trust_score),
      scamRisk: row.scam_risk,
      scamReasons: row.scam_reasons || [],
      owner: row.owner,
      serialNumber: row.serial_number,
      invoiceVerified: row.invoice_verified,
      rentHistory: row.rent_history || [],
      gradientTheme: row.gradient_theme,
      specifications: row.specifications || [],
      conditionReport: row.condition_report || [],
      image: row.image
    }));
    res.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    await pool.query(`
      INSERT INTO public.products (
        id, title, description, category, brand, condition, rent_per_day, security_deposit, price,
        address, city, rating, reviews_count, availability, trust_score, scam_risk, scam_reasons,
        owner, serial_number, invoice_verified, rent_history, gradient_theme, specifications, condition_report, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
    `, [
      p.id, p.title, p.description, p.category, p.brand, p.condition, p.rentPerDay, p.securityDeposit, p.price,
      p.address, p.city, p.rating, p.reviewsCount, p.availability, p.trustScore, p.scamRisk, p.scamReasons,
      JSON.stringify(p.owner), p.serialNumber, p.invoiceVerified, JSON.stringify(p.rentHistory), p.gradientTheme,
      JSON.stringify(p.specifications), p.conditionReport, p.image
    ]);
    res.status(201).json(p);
  } catch (err) {
    console.error('POST /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM public.products WHERE id = $1', [id]);
    res.json({ message: `Product ${id} deleted successfully` });
  } catch (err) {
    console.error('DELETE /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH product trust score
app.patch('/api/products/:id/trust', async (req, res) => {
  try {
    const { id } = req.params;
    const { trustScore } = req.body;
    let scamRisk = 'Low';
    if (trustScore < 50) scamRisk = 'High';
    else if (trustScore < 80) scamRisk = 'Medium';

    await pool.query(
      'UPDATE public.products SET trust_score = $1, scam_risk = $2 WHERE id = $3',
      [trustScore, scamRisk, id]
    );
    res.json({ message: 'Trust score updated successfully', trustScore, scamRisk });
  } catch (err) {
    console.error('PATCH /api/products trust error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET applications
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.applications ORDER BY created_at DESC');
    const applications = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      propertyId: row.product_id,
      propertyTitle: row.product_title,
      status: row.status,
      date: row.date ? row.date.toISOString().split('T')[0] : '',
      totalAmount: row.total_amount,
      deposit: row.deposit
    }));
    res.json(applications);
  } catch (err) {
    console.error('GET /api/applications error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST new application
app.post('/api/applications', async (req, res) => {
  try {
    const appData = req.body;
    const result = await pool.query(`
      INSERT INTO public.applications (
        user_id, product_id, product_title, status, date, total_amount, deposit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, date
    `, [
      appData.user_id || 'renter-1',
      appData.propertyId,
      appData.propertyTitle,
      appData.status || 'Under AI Review',
      appData.date || new Date().toISOString().split('T')[0],
      appData.totalAmount,
      appData.deposit
    ]);

    const created = {
      ...appData,
      id: result.rows[0].id,
      date: result.rows[0].date.toISOString().split('T')[0]
    };
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/applications error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH application approval
app.patch('/api/applications/:productId/approve', async (req, res) => {
  try {
    const { productId } = req.params;
    await pool.query(
      "UPDATE public.applications SET status = 'Booked (Verified)' WHERE product_id = $1",
      [productId]
    );
    res.json({ message: 'Application approved successfully' });
  } catch (err) {
    console.error('PATCH /api/applications approve error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start listening
app.listen(port, () => {
  console.log(`🚀 Gateway Server running at http://localhost:${port}`);
});
