console.log('Checking environment variables...\n')

const requiredVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
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

console.log('\nSanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not set')
console.log('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not set')

if (!process.env.DATABASE_URL) {
  console.log('\n⚠️  WARNING: DATABASE_URL is not set. The application will not be able to connect to the database.')
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.log('\n⚠️  WARNING: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity CMS will not work.')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.log('\n⚠️  WARNING: NEXT_PUBLIC_SANITY_DATASET is not set. Sanity CMS will not work.')
}
