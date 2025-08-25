"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Demo data (replace with API data)
const shareData = [
  { id: 1, date: "2025-08-01", shareType: "Ordinary",   unit: 10, amount: 500,  status: "Active" },
  { id: 2, date: "2025-08-05", shareType: "Preference", unit: 20, amount: 1200, status: "Pending" },
  { id: 3, date: "2025-08-10", shareType: "Ordinary",   unit: 5,  amount: 250,  status: "Active" },
  { id: 4, date: "2025-08-12", shareType: "Preference", unit: 15, amount: 900,  status: "Closed" },
  { id: 5, date: "2025-08-15", shareType: "Ordinary",   unit: 30, amount: 1500, status: "Approved" },
  { id: 6, date: "2025-08-18", shareType: "Preference", unit: 8,  amount: 400,  status: "Rejected" },
]

// ✅ Styled status badge
function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase()
  const style =
    key === "active"
      ? "bg-green-100 text-green-700 border border-green-200"
      : key === "pending"
      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
      : key === "approved"
      ? "bg-blue-100 text-blue-700 border border-blue-200"
      : key === "rejected"
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-gray-100 text-gray-700 border border-gray-200" // closed/others

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

export default function ShareTable() {
  const [search, setSearch] = React.useState("")
  const [shareType, setShareType] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [unit, setUnit] = React.useState("")
  const [date, setDate] = React.useState("")
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 5

  // Filter + Search
  const filteredData = shareData.filter((item) => {
    const matchesSearch =
      search === "" ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    const matchesShareType = shareType === "" || item.shareType === shareType
    const matchesStatus = status === "" || item.status === status
    const matchesUnit = unit === "" || item.unit === Number(unit)
    const matchesDate = date === "" || item.date === date

    return (
      matchesSearch &&
      matchesShareType &&
      matchesStatus &&
      matchesUnit &&
      matchesDate
    )
  })

  const pageCount = Math.ceil(filteredData.length / rowsPerPage) || 1
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  // Reset to page 1 when filters/search change
  React.useEffect(() => {
    setPage(1)
  }, [search, shareType, status, unit, date])

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search (type, unit, amount, status, date)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select value={shareType} onValueChange={setShareType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Share Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ordinary">Ordinary</SelectItem>
            <SelectItem value="Preference">Preference</SelectItem>
            <SelectItem value="Bonus">Bonus</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-[120px]"
        />

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-[180px]"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Share Type</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.shareType}</TableCell>
                <TableCell>{item.unit.toLocaleString()}</TableCell>
                <TableCell>{item.amount.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={item.status} /></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className={page === pageCount ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
