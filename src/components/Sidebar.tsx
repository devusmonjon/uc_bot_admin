"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { CreditCard, Package, Settings, User, LogOut, Menu, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/cards", label: "Kartalar", icon: CreditCard },
  { href: "/pubg-sets", label: "PUBG To'plamlar", icon: Package },
  { href: "/bot-settings", label: "Bot Sozlamalari", icon: Settings },
  { href: "/profile", label: "Profil Sozlamalari", icon: User },
  { href: "/users", label: "Profil Sozlamalari", icon: Users },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({callbackUrl: "/login"})
  }

  return (
    <div
      className={cn(
        "bg-white shadow-md h-full flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center p-2 rounded-lg transition-all duration-200 ease-in-out",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              isCollapsed && "justify-center",
            )}
          >
            <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <Button onClick={handleLogout} variant="outline" className={cn("w-full", isCollapsed && "p-2")}>
          <LogOut className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
          {!isCollapsed && "Chiqish"}
        </Button>
      </div>
    </div>
  )
}

