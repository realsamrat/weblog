import { getPayload } from 'payload'
import config from '../payload.config'

async function initPayload() {
  console.log('Initializing Payload CMS...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
  console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'Set' : 'Not set')
  
  try {
    const payload = await getPayload({ 
      config,
      disableDBConnect: false,
      initOptions: {
        onInit: async (payload) => {
          console.log('Payload initialized successfully!')
        }
      }
    })
    
    console.log('Payload is ready!')
    
    // Try to count users
    const users = await payload.count({
      collection: 'payload_authors'
    })
    
    console.log(`Found ${users.totalDocs} users in database`)
    
    if (users.totalDocs === 0) {
      console.log('\nNo users found. Creating admin user...')
      
      const admin = await payload.create({
        collection: 'payload_authors',
        data: {
          email: 'admin@example.com',
          password: 'admin123',
          name: 'Admin User',
        },
      })
      
      console.log('Admin user created!')
      console.log('Email: admin@example.com')
      console.log('Password: admin123')
    }
    
  } catch (error) {
    console.error('Error initializing Payload:', error)
  } finally {
    process.exit()
  }
}

initPayload()