import { Pool } from 'pg'

async function testConnection() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('DATABASE_URL is not set!')
    process.exit(1)
  }
  
  console.log('Testing database connection...')
  console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'))
  
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  })
  
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful!')
    console.log('Current time from database:', result.rows[0].now)
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    console.log('\nTables found:', tablesResult.rows.length)
    if (tablesResult.rows.length > 0) {
      console.log('Tables:', tablesResult.rows.map(r => r.table_name).join(', '))
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await pool.end()
    process.exit()
  }
}

testConnection()