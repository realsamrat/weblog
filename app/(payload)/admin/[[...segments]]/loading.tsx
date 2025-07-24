export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Loading Payload Admin...</h2>
        <p>If this takes too long, check the server console for errors.</p>
      </div>
    </div>
  )
}