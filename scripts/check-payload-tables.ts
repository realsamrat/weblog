import { Pool } from 'pg'

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'payload_%'
      ORDER BY table_name;
    `)
    
    console.log('Payload tables in database:')
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`)
    })
    
    if (result.rows.length === 0) {
      console.log('No Payload tables found!')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkTables()