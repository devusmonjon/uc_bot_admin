"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function BotSettingsPage() {
  const [ucPrice, setUcPrice] = useState("")
  const [_id, set_id] = useState("")
  const [changer, setchanger] = useState(false)

  const fetchdata = async () => {
    try {
      const res = await axios.get("/api/constants")
      setUcPrice(res.data.data.constants.price)
      set_id(res.data.data.constants._id)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik iltimos sahifani yangilang",
        variant: "destructive"
      })
    }
  }
  useEffect(() => {
    fetchdata()
  }, [changer])

  const saveSettings = async () => {
    if (_id) {
      try {
        const res = await axios.put(`/api/constants/${_id}`, {price: ucPrice})
        if (res) {
          toast({
            title: "Muaffaqiyatli",
            description: "Sozlamalar muaffaqiyatli saqlandi",
            variant: "default"
          })
          setchanger((prev) => !prev)
        }
      } catch (error) {
        setchanger((prev) => !prev)
        toast({
          title: "Xatolik",
          description: "Sozlamalarni saqlashda xatolik iltimos qaytadan urunib ko'ring",
          variant: "destructive"
        })
      }
    }
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
            className="read-only:opacity-50"
              type="number"
              placeholder="1 UC narxi"
              value={ucPrice}
              onChange={(e) => setUcPrice(e.target.value)}
              readOnly
              onDoubleClick={(e) => {
                const target = e.currentTarget
                target.readOnly = false,
                target.focus()
              }}
              onBlur={(e) => {
                const target = e.currentTarget
                target.setAttribute("readOnly", "true")
              }}
            />
            <Button onClick={saveSettings}>Saqlash</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

