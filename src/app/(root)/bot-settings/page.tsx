"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BotSettingsPage() {
  const [ucPrice, setUcPrice] = useState("")

  const saveSettings = () => {
    // Bu yerda UC narxini saqlash uchun API chaqiruvi qilish kerak
    console.log("UC narxi saqlandi:", ucPrice)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bot Sozlamalari</h2>
      <Card>
        <CardHeader>
          <CardTitle>UC Narxi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="1 UC narxi"
              value={ucPrice}
              onChange={(e) => setUcPrice(e.target.value)}
            />
            <Button onClick={saveSettings}>Saqlash</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

