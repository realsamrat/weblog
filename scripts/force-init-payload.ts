import { spawn } from 'child_process'
import path from 'path'

async function forceInitPayload() {
  console.log('Force initializing Payload CMS...')
  
  const initProcess = spawn('tsx', ['scripts/init-payload.ts'], {
    cwd: path.resolve(process.cwd()),
    env: { ...process.env },
    stdio: ['pipe', 'inherit', 'inherit']
  })

  // Wait a bit for the prompt to appear
  setTimeout(() => {
    // Send "1" to select the first option (create new enum)
    initProcess.stdin.write('1\n')
    
    // Handle any other prompts that might appear
    setTimeout(() => {
      initProcess.stdin.write('\n')
    }, 2000)
    
    setTimeout(() => {
      initProcess.stdin.write('y\n')
    }, 4000)
  }, 10000)

  initProcess.on('close', (code) => {
    console.log(`Process exited with code ${code}`)
    process.exit(code || 0)
  })
}

forceInitPayload()