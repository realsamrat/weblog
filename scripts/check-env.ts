console.log('Checking environment variables...\n')

const requiredVars = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL'
]

const optionalVars = [
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_REGION',
  'S3_BUCKET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

console.log('Required variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '[REDACTED]' : value.substring(0, 30) + '...'}`)
  } else {
    console.log(`❌ ${varName}: Not set`)
  }
})

console.log('\nOptional variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '[REDACTED]' : value}`)
  } else {
    console.log(`⚪ ${varName}: Not set`)
  }
})

console.log('\nPayload Secret length:', process.env.PAYLOAD_SECRET?.length || 0, '(should be at least 32)')

if (!process.env.DATABASE_URL) {
  console.log('\n⚠️  WARNING: DATABASE_URL is not set. Payload CMS will not be able to connect to the database.')
}

if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
  console.log('\n⚠️  WARNING: PAYLOAD_SECRET should be at least 32 characters long for security.')
}