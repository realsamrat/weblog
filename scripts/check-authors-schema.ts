import { Pool } from 'pg'

async function checkSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'payload_authors'
      ORDER BY ordinal_position;
    `)
    
    console.log('Columns in payload_authors table:')
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkSchema()