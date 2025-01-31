"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function Sidebar() {
  const router = useRouter()

  const handleLogout = async () => {
    // Bu yerda chiqish logikasi bo'lishi kerak
    await signOut()
  }

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/cards" className="block p-2 hover:bg-gray-100 rounded">
            Kartalar
          </Link>
          <Link href="/pubg-sets" className="block p-2 hover:bg-gray-100 rounded">
            PUBG To'plamlar
          </Link>
          <Link href="/bot-settings" className="block p-2 hover:bg-gray-100 rounded">
            Bot Sozlamalari
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Chiqish
        </Button>
      </div>
    </div>
  )
}

