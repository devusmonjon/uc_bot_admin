"use client";

import { useState, useRef, useEffect } from "react";
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
import { PlusCircle, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface PubgSet {
  _id: number;
  name: number;
  image: string;
  price: number;
}

export default function PubgSetsPage() {
  const [sets, setSets] = useState<PubgSet[]>([]);
  const [newSet, setNewSet] = useState({ name: "", image: "", price: 0 });
  const [editingSet, setEditingSet] = useState<PubgSet | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [changer, setchanger] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const editRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/uc");
      setSets(response.data.data.uc);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "To'plamlarni yuklashda xatolik yuz berdi.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [changer]);

  const addSet = async () => {
    console.log("addSet function called", newSet); // Debugging uchun
    if (newSet.price > 0) {
      try {
        await axios.post("/api/uc", { ...newSet });
        setchanger((prev) => !prev);
        setPreviewImage(null);
        setIsAddModalOpen(false);
        toast({
          title: "To'plam qo'shildi",
          description: `"${newSet.name}" to'plami muvaffaqiyatli qo'shildi.`,
        });
      } catch (error) {
        toast({
          title: "Xatolik",
          description:
          // @ts-expect-error: error is not defined
            error.message || "To'plamni yuklashda xatolik yuz berdi.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Xatolik",
        description:
          "Iltimos, barcha maydonlarni to'ldiring va narx 0 dan katta bo'lsin.",
        variant: "destructive",
      });
    }
  };

  const updateSet = async () => {
    if (editingSet && editingSet.name && editingSet.price > 0) {
      try {
        await axios.put(`/api/uc/${editingSet._id}`, {
          ...editingSet
        });
        setchanger((prev) => !prev);
        setEditingSet(null);
        setPreviewImage(null);
        editRef.current?.click();
        toast({
          title: "To'plam yangilandi",
          description: `"${editingSet.name}" to'plami muvaffaqiyatli yangilandi.`,
        });
      } catch (error) {
        toast({
          title: "Xatolik",
          description:
          // @ts-expect-error: error is not defined
            error.message || "To'plamni yangilashda xatolik yuz berdi.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Xatolik",
        description:
          "Iltimos, barcha maydonlarni to'ldiring va narx 0 dan katta bo'lsin.",
        variant: "destructive",
      });
    }
  };

  const deleteSet = async (id: number) => {
    try {
      await axios.delete(`/api/uc/${id}`);
      setchanger((prev) => !prev);
      deleteRef.current?.click();
      toast({
        title: "To'plam o'chirildi",
        description: "To'plam muvaffaqiyatli o'chirildi.",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
        // @ts-expect-error: error is not defined
          error.message || "To'plamni o'chirishda xatolik yuz berdi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">PUBG UC'lar</h2>
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" /> UC qo'shish
      </Button>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {sets?.map((set) => (
          <Card key={set._id}>
            <CardHeader>
              <CardTitle>{set.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Narxi: {set.price} UC</p>
              <div className="flex gap-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingSet(set);
                      }}
                      ref={editRef}
                    >
                      Tahrirlash
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>UC'ni tahrirlash</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right">
                          Soni
                        </Label>
                        <Input
                          id="edit-name"
                          type="number"
                          value={editingSet?.name}
                          onChange={(e) =>
                            setEditingSet((prev) =>
                              prev ? { ...prev, name: +e.target.value } : null
                            )
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-price" className="text-right">
                          Narxi
                        </Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editingSet?.price}
                          onChange={(e) =>
                            setEditingSet((prev) =>
                              prev
                                ? { ...prev, price: Number(e.target.value) }
                                : null
                            )
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={updateSet}>Saqlash</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" ref={deleteRef}>O'chirish</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Tasdiqlash</h4>
                        <p className="text-sm text-muted-foreground">
                          Haqiqatan ham bu UC'ni o'chirmoqchimisiz?
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {}}>
                          Bekor qilish
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteSet(set._id)}
                        >
                          O'chirish
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi UC qo'shish</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nomi
              </Label>
              <Input
                id="name"
                value={newSet.name}
                onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Narxi
              </Label>
              <Input
                id="price"
                type="number"
                value={newSet.price}
                onChange={(e) =>
                  setNewSet({ ...newSet, price: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
          <DialogFooter>
            <Button
              onClick={() => {
                console.log("Qo'shish tugmasi bosildi"); // Debugging uchun
                addSet();
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
