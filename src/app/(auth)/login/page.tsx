"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password)
      return toast({
        title: "Xatolik",
        description: "Iltimos, barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    // Bu yerda haqiqiy autentifikatsiya logikasi bo'lishi kerak
    if (res?.ok) {
      router.push("/");
    } else {
      toast({
        title: "Xatolik",
        description: "Iltimos, ma'lumotlarni to'gri kiriting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin Panel - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Foydalanuvchi nomi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Kirish
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
