import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quantum Error Mitigation — ZNE Study',
  description: 'Zero-Noise Extrapolation with gate folding and measurement error mitigation on Grover\'s search and QFT circuits',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
