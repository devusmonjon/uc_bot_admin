"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { BadgeCheck, PlusCircle, Shield, ShieldCheck } from "lucide-react";
import axios from "axios";
import PageLoading from "../loading";
import { formatCardNumber } from "@/lib/helpers";
import { toast } from "@/hooks/use-toast";

interface CardData {
  _id: number;
  number: string;
  name: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [newCard, setNewCard] = useState({ number: "", name: "" });
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [changer, setChanger] = useState(false);

  const fetchCards = async () => {
    try {
      const response = await axios.get("https://adminuc.up-it.uz/api/cards");
      console.log(response.data.data.cards);
      setCards(response.data.data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [changer]);

  const addCard = async () => {
    try {
        const response = await axios.post("https://adminuc.up-it.uz/api/cards", newCard);
        setChanger((prev) => !prev);
        if (response) {
            toast({
                title: "Muvaffaqqiyatli",
                description: "Karta muvaffaqiyatli qo'shildi",
                variant: "default",
            })
        }
    } catch (error) {
        toast({
            title: "Xatolik",
            description: "Karta qo'shishda xatolik, qaytadan urunib ko'ring",
            variant: "destructive",
        })
    }
  };

  const updateCard = async () => {
    if (editingCard) {
      try {
        await axios.put(`https://adminuc.up-it.uz/api/cards/${editingCard._id}`, editingCard);
        setChanger((prev) => !prev);
        toast({
          title: "Muvaffaqqiyatli",
          description: "Karta muvaffaqiyatli yangilandi",
          variant: "default",
        })
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Karta yangilashda xatolik, qaytadan urunib ko'ring",
          variant: "destructive",
        })
      }
    }
  };

  const deleteCard = async (id: number) => {
    try {
        await axios.delete(`https://adminuc.up-it.uz/api/cards/${id}`);
        setChanger((prev) => !prev);
        toast({
            title: "Muvaffaqqiyatli",
            description: "Karta muvaffaqiyatli o'chirildi",
            variant: "default",
        })
    } catch (error) {
        toast({
            title: "Xatolik",
            description: "Karta o'chirishda xatolik, qaytadan urunib ko'ring",
            variant: "destructive",
        })
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kartalar</h2>
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" /> Karta qo'shish
      </Button>
      {cards.length == 0 && <PageLoading />}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
      {cards?.map((card) => (
        <Card key={card._id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-300 p-6 text-white">
              <div className="mb-4 flex justify-between items-start">
                <h3 className="font-medium">{card.name}</h3>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white text-[16px] font-bold"
                        onClick={() => setEditingCard(card)}
                      >
                        Tahrirlash
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kartani tahrirlash</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Ism
                          </Label>
                          <Input
                            id="name"
                            value={editingCard?.name}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard!,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="number" className="text-right">
                            Karta raqami
                          </Label>
                          <Input
                            id="number"
                            value={editingCard?.number}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard!,
                                number: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={updateCard}>Saqlash</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="destructive" size="sm" className="text-[16px] font-bold">
                        O'chirish
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Tasdiqlash</h4>
                          <p className="text-sm text-muted-foreground">Haqiqatan ham bu kartani o'chirmoqchimisiz?</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => {}}>
                            Bekor qilish
                          </Button>
                          <Button variant="destructive" onClick={() => deleteCard(card._id)}>
                            O'chirish
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold tracking-wider">{formatCardNumber(card.number.toString())}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6" />
                </div>
                <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center" >
                    <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi karta qo'shish</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Ism
              </Label>
              <Input
                id="name"
                value={newCard.name}
                onChange={(e) =>
                  setNewCard({ ...newCard, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Karta raqami
              </Label>
              <Input
                id="number"
                value={newCard.number}
                onChange={(e) =>
                  setNewCard({ ...newCard, number: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                addCard();
                setIsAddModalOpen(false);
              }}
            >
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
