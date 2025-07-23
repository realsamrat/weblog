import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function createAdmin() {
  try {
    console.log('Starting admin creation...')
    const payload = await getPayload({ config: configPromise })
    
    const admin = await payload.create({
      collection: 'payload_authors',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
      },
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createAdmin()