import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const env = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'Set' : 'Not set',
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    }
    
    // Try to import Payload config
    let configStatus = 'Not checked'
    try {
      const config = await import('@payload-config')
      configStatus = config ? 'Loaded successfully' : 'Failed to load'
    } catch (error: any) {
      configStatus = `Error: ${error.message}`
    }
    
    return NextResponse.json({
      status: 'ok',
      environment: env,
      payloadConfig: configStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}