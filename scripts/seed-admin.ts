import { getPayload } from 'payload'
import config from '../payload.config'

async function seedAdmin() {
  const payload = await getPayload({ config })

  try {
    // Check if admin user already exists
    const existingUsers = await payload.find({
      collection: 'payload_authors',
      where: {
        email: {
          equals: 'admin@example.com',
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    await payload.create({
      collection: 'payload_authors',
      data: {
        email: 'admin@example.com',
        password: 'admin123', // Change this in production!
        name: 'Admin User',
      },
    })

    console.log('Admin user created successfully')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    console.log('Please change the password after first login!')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    process.exit()
  }
}

seedAdmin()