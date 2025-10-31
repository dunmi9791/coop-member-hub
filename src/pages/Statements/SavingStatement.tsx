"use client"

import React, { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from  "jspdf-autotable"

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

const SavingStatement = () => {


//  Sample savings transactions
const savingsData = [
  { id: 1, date: "2025-01-05", description: "Monthly Savings", amount: 5000, balance: 5000, status: "Credit" },
  { id: 2, date: "2025-02-05", description: "Monthly Savings", amount: 5000, balance: 10000, status: "Credit" },
  { id: 3, date: "2025-03-10", description: "Withdrawal", amount: -2000, balance: 8000, status: "Debit" },
  { id: 4, date: "2025-04-05", description: "Monthly Savings", amount: 5000, balance: 13000, status: "Credit" },
  { id: 5, date: "2025-05-15", description: "Withdrawal", amount: -3000, balance: 10000, status: "Debit" },
]

// Styled status badge
function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase()
  const style =
    key === "credit"
      ? "bg-green-100 text-green-700 border border-green-200"
      : key === "debit"
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-gray-100 text-gray-700 border border-gray-200"

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [date, setDate] = useState("")
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  // Filtering logic
  const filteredData = savingsData.filter((item) => {
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
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  useEffect(() => {
    setPage(1)
  }, [search, status, date])

const generatePDF = () => {
  const doc:any = new jsPDF();

  // --- Header ---
  doc.setFontSize(18);
  doc.text("Savings Statement", 14, 20);

  doc.setFontSize(12);
  doc.text("Name: John Doe", 14, 30);
  doc.text("Account No: 1234567890", 14, 37);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 44);

  // --- Table setup ---
  const tableColumn = ["Date", "Description", "Amount (₦)", "Balance (₦)", "Status"];

  // ✅ Use the full dataset (not just paginated rows)
  const tableRows = savingsData.map((txn) => [
    txn.date,
    txn.description,
    `₦${txn.amount.toLocaleString()}`,
    `₦${txn.balance.toLocaleString()}`,
    txn.status,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }, // blue header
    alternateRowStyles: { fillColor: [240, 240, 240] }, // striped
    margin: { top: 50 },
    didDrawPage: (data) => {
      // --- Footer with page number ---
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    },
  });

  // --- Save file ---
  doc.save("savings-statement.pdf");
};

  return (
    <div className="mt-5 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between align-items-center">
        <h1 className="text-2xl font-bold text-gray-800">Savings statement</h1>
          {/*  Download Button */}
        <button
          onClick={generatePDF}
          className="bg-[#043d73] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download as PDF
        </button>
        </div>
        {/* 🔎 Search + Filters */}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search (description, amount, date)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

        </div>

        {/* Savings Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
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
                  <TableCell>{item.description}</TableCell>
                  <TableCell className={item.amount < 0 ? "text-red-500" : "text-green-600"}>
                    ₦{item.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>₦{item.balance.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 📄 Pagination */}
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

export default SavingStatement