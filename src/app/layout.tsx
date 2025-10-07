import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin']});

export const metadata = {
  title: "Spotify Analyst",
  description: "Discover your listening habits and future favorites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}