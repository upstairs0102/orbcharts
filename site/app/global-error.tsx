// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#131417', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#f56565' }}>Something went wrong!</h2>
          <p style={{ fontSize: '1rem', color: '#a0aec0', margin: '0 0 2rem 0', overflowWrap: 'break-word', wordBreak: 'break-all' }}>{error.message || 'An unexpected layout error occurred.'}</p>
          <button
            onClick={() => reset()}
            style={{ backgroundColor: '#0072d6', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
