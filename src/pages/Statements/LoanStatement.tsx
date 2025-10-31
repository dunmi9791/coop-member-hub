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
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// ✅ Styled status badge
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
      : key === "completed"
      ? "bg-green-200 text-green-900 border border-green-300"
      : key === "processing"
      ? "bg-orange-100 text-orange-700 border border-orange-200"
      : "bg-gray-100 text-gray-700 border border-gray-200"

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  )
}


export default function LoanStatement() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [date, setDate] = React.useState("")
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 5

  const loanData=[
  {
    id: 1,
    date: "2025-08-01",
    transactionType: "Repayment",
    reference: "TXN-1001",
    debit: 0,
    credit: 5000,
    balance: 15000,
    status: "Completed"
  },
  {
    id: 2,
    date: "2025-08-05",
    transactionType: "Disbursement",
    reference: "TXN-1002",
    debit: 10000,
    credit: 0,
    balance: 5000,
    status: "Processing"
  }
]

  // ✅ Filter + Search
  const filteredData = loanData.filter((item) => {
    const matchesSearch =
      search === "" ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    const matchesStatus = status === "" || item.status === status
    const matchesDate = date === "" || item.date === date

    return matchesSearch && matchesStatus && matchesDate
  })

  const pageCount = Math.ceil(filteredData.length / rowsPerPage) || 1
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  // ✅ Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [search, status, date])

  // ✅ PDF Export
  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text("Loan Transactions Statement", 14, 10)

    autoTable(doc, {
      head: [["S/N", "Date", "Description", "Debit", "Credit", "Balance", "Status"]],
      body: filteredData.map((item, i) => [
        i + 1,
        item.date,
        // item.description,
        item.debit?.toLocaleString() || "-",
        item.credit?.toLocaleString() || "-",
        item.balance?.toLocaleString() || "-",
        item.status,
      ]),
      startY: 20,
    })

    doc.save("loan-statement.pdf")
  }

  return (
       <div className="mt-5 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
         <div className="flex justify-between align-items-center">
        <h1 className="text-2xl font-bold text-gray-800">Loan statement</h1>
          {/*  Download Button */}
        <button
          onClick={exportPDF}
          className="bg-[#043d73] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download as PDF
        </button>
        </div>
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search (description, debit, credit, balance)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Date</TableHead>
            {/* <TableHead>Description</TableHead> */}
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.date}</TableCell>
                {/* <TableCell>{item.description}</TableCell> */}
                <TableCell>{item.debit?.toLocaleString() || "-"}</TableCell>
                <TableCell>{item.credit?.toLocaleString() || "-"}</TableCell>
                <TableCell>{item.balance?.toLocaleString() || "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
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
    </div>
  )
}
