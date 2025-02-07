"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Settings, MoreHorizontal, Trash, ToggleLeft, Search } from "lucide-react"
import axios from "axios"

interface User {
  _id: string
  telegramId: number
  lang: string
  role: string
  step: number
  currentOrderId: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  username?: string
}

interface PaginationData {
  totalUsers: number
  totalPages: number
  currentPage: number
  limit: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationData>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  })

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const response = await axios.get("/api/users", {
        params: { page, search },
      })
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers(pagination.currentPage, searchQuery)
  }, [searchQuery])

  const toggleUserStatus = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/toggle-status`)
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: !user.status } : user)))
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}`)
      setUsers(users.filter((user) => user._id !== userId))
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    const allSelected = users.every((user) => selectedUsers.includes(user._id))
    if (allSelected) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user._id))
    }
  }

  const bulkToggleStatus = async () => {
    try {
      await axios.patch("/api/users/bulk-toggle-status", { userIds: selectedUsers })
      setUsers(users.map((user) => (selectedUsers.includes(user._id) ? { ...user, status: !user.status } : user)))
    } catch (error) {
      console.error("Error bulk toggling user status:", error)
    }
  }

  const bulkDeleteUsers = async () => {
    try {
      await axios.delete("/api/users/bulk-delete", { data: { userIds: selectedUsers } })
      setUsers(users.filter((user) => !selectedUsers.includes(user._id)))
      setSelectedUsers([])
    } catch (error) {
      console.error("Error bulk deleting users:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ko'rinish</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Kompakt</DropdownMenuItem>
              <DropdownMenuItem>Kengaytirilgan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button onClick={bulkToggleStatus}>
              <ToggleLeft className="mr-2 h-4 w-4" />
              Statusni o'zgartirish
            </Button>
            <Button variant="destructive" onClick={bulkDeleteUsers}>
              <Trash className="mr-2 h-4 w-4" />
              O'chirish
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onCheckedChange={toggleAllUsers}
                />
              </TableHead>
              <TableHead>Telegram ID</TableHead>
              <TableHead>Til</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onCheckedChange={() => toggleSelectUser(user._id)}
                  />
                </TableCell>
                <TableCell>{user.telegramId}</TableCell>
                <TableCell>{user.lang}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch checked={user.status} onCheckedChange={() => toggleUserStatus(user._id)} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Amallar</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setUserToDelete(user._id)
                          setIsDeleteModalOpen(true)
                        }}
                      >
                        O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => fetchUsers(Math.max(pagination.currentPage - 1, 1))}
              // @ts-expect-error: error is not defined
              disabled={pagination.currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => fetchUsers(page)} isActive={pagination.currentPage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => fetchUsers(Math.min(pagination.currentPage + 1, pagination.totalPages))}
              // @ts-expect-error: error is not defined
              disabled={pagination.currentPage === pagination.totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foydalanuvchini o'chirishni tasdiqlaysizmi?</DialogTitle>
            <DialogDescription>
              Bu amalni qaytarib bo'lmaydi. Foydalanuvchi ma'lumotlari butunlay o'chiriladi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={() => userToDelete && deleteUser(userToDelete)}>
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

