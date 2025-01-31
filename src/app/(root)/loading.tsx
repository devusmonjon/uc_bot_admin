"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

export default function PageLoading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="w-64 space-y-6">
        <div className="flex justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-black dark:text-white" />
        </div>
        <Progress
          value={progress}
          className="w-full bg-gray-200 dark:bg-gray-800"
        />
        <div className="flex justify-between text-sm text-black dark:text-white">
          <span>Yuklanmoqda</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === Math.floor(progress / 33) ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
      {progress === 100 && <div className="mt-4 text-destructive">Yuklash tugallandi!</div>}
    </div>
  )
}

