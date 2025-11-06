import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'StromPlan.at - Transparent Electricity Comparison for Austria',
  description: 'Upload your electricity bill and discover how much you\'re really paying. Get transparent recommendations for better energy providers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
