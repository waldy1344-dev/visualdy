import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/components/QueryProvider'

export const metadata: Metadata = {
  title: 'Visualdy — Simple. Creative. Impactful.',
  description: 'Jasa desain grafis profesional — logo, banner, konten sosial media, dan video. Pesan sekarang via WhatsApp.',
  keywords: 'jasa desain grafis, desain logo, banner, konten sosial media, freelance desainer',
  openGraph: {
    title: 'Visualdy — Simple. Creative. Impactful.',
    description: 'Jasa desain grafis profesional. Pesan sekarang via WhatsApp.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
