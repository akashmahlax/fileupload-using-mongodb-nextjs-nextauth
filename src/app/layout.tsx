import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import AuthStatus from "@/components/auth-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "File Upload App",
  description: "Upload and manage your files",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              File Upload App
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
              <Link href="/images" className="hover:text-gray-300">
                Images
              </Link>
              <Link href="/videos" className="hover:text-gray-300">
                Videos
              </Link>
              <AuthStatus />
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

