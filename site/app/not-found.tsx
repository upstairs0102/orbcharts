// app/not-found.tsx
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#131417', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>404</h1>
          <p style={{ fontSize: '1.25rem', color: '#a0aec0', margin: '0 0 2rem 0' }}>Page Not Found</p>
          <a href={`${BASE_PATH}/en`} style={{ color: '#0072d6', textDecoration: 'underline', fontWeight: 'bold' }}>Go to Homepage</a>
        </div>
      </body>
    </html>
  )
}
