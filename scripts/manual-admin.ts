import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

async function createAdminManually() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    // Generate salt and hash the password
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = await bcrypt.hash(salt + 'admin123', 10)
    
    // Insert admin user
    const result = await pool.query(
      `INSERT INTO payload_authors (email, salt, hash, name, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING id, email, name`,
      ['admin@example.com', salt, hash, 'Admin User']
    )
    
    console.log('✅ Admin user created manually!')
    console.log('User:', result.rows[0])
    console.log('\nLogin credentials:')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
  } catch (error: any) {
    if (error.code === '23505') {
      console.log('Admin user already exists!')
    } else {
      console.error('Error:', error)
    }
  } finally {
    await pool.end()
  }
}

createAdminManually()