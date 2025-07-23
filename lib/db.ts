import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Optimize connection handling for better performance and stability
  transactionOptions: {
    maxWait: 5000, // 5s for stability
    timeout: 20000, // Increased to 20s for slower operations
  },
  // Enable query optimizations
  errorFormat: 'minimal',
})

// Add connection retry logic with exponential backoff
const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      console.log('Database connected successfully')
      return
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error)
      if (i === retries - 1) {
        console.error('All database connection attempts failed')
        throw error
      }
      const delay = Math.min(1000 * Math.pow(2, i), 10000) // Exponential backoff, max 10s
      console.log(`Retrying connection in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Enhanced connection health check
const ensureConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.warn('Database connection health check failed:', error)
    try {
      await connectWithRetry(3)
      return true
    } catch (retryError) {
      console.error('Failed to restore database connection:', retryError)
      return false
    }
  }
}

// Enable relationJoins for better query performance
if (process.env.NODE_ENV === 'development') {
  prisma.$extends({
    name: 'performance-logging',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = Date.now()
          try {
            // Ensure connection before query
            await ensureConnection()
            
            const result = await query(args)
            const end = Date.now()
            
            if (end - start > 100) {
              console.log(`Slow query detected: ${model}.${operation} took ${end - start}ms`)
            }
            
            return result
          } catch (error) {
            const end = Date.now()
            console.error(`Query failed: ${model}.${operation} took ${end - start}ms`, error)
            
            // If it's a connection error, try to reconnect
            if (error instanceof Error && (
              error.message.includes('connection') || 
              error.message.includes('Connection') ||
              error.message.includes('Closed')
            )) {
              console.log('Attempting to reconnect to database...')
              await connectWithRetry(2)
            }
            
            throw error
          }
        }
      }
    }
  })
}

// Optimize connection pooling for better performance
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Enhanced graceful shutdown with connection cleanup
const gracefulShutdown = async () => {
  console.log('Shutting down database connections...')
  try {
    await prisma.$disconnect()
    console.log('Database disconnected successfully')
  } catch (error) {
    console.error('Error during database disconnect:', error)
  }
}

process.on('beforeExit', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Connection warmup with retry logic
if (process.env.NODE_ENV === 'production') {
  connectWithRetry().catch(console.error)
} else {
  // In development, connect on first use but with health checks
  prisma.$connect().catch(error => {
    console.warn('Initial database connection failed, will retry on first query:', error.message)
  })
  
  // Periodic health check in development
  setInterval(async () => {
    await ensureConnection()
  }, 30000) // Check every 30 seconds
} 