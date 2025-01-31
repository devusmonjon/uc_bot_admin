"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import axios from "axios"

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [changer, setchanger] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const session = useSession()

  useEffect(() => {
    // @ts-expect-error: error is not defined
    if (session.data?.user.username) {
        // @ts-expect-error: error is not defined
        setUsername(session.data.user?.username as string)
    }
  }, [session, changer])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await axios.put("/api/profile", { username, password });
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Profil ma'lumotlari yangilandi",
      })
    } catch (error) {
      toast({
        title: "Xato",
        description: "Xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
        setPassword("")
        session.update()
        setchanger(prev => !prev)
      setIsLoading(false)
    }
  }

  return (
        <Card>
          <CardHeader>
            <CardTitle>Profil Sozlamalari</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Foydalanuvchi nomi</Label>
                <Input id="username" placeholder="Foydalanuvchi nomini kiriting" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Yangi parol</Label>
                <Input id="password" type="password" placeholder="Yangi parolni kiriting" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </form>
          </CardContent>
        </Card>
  )
}

