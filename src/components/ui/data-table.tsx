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



// ✅ Styled status badge
export function StatusBadge({ status }: { status: string }) {
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

interface Investment {
  id: number;
  reference: string;
  certificate_number: string;
  investment_type: string;
  amount: number;
  currency: string;
  start_date: string;
  maturity_date: string;
  days_to_maturity: number;
  status: string;
  interest_rate: number;
  tenor: string;
}

export default function DataTable({ data = [], shareData, columns }: { data?: Investment[], shareData?: any[], columns?: any[] }) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 10

  const tableData = data.length > 0 ? data : (shareData || []);

  // Filter + Search
  const filteredData = tableData.filter((item) => {
    const matchesSearch =
      search === "" ||
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )

    return matchesSearch
  })

  const pageCount = Math.ceil(filteredData.length / rowsPerPage) || 1
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns ? (
                columns.map((col, i) => (
                  <TableHead key={i}>{col.Header}</TableHead>
                ))
              ) : (
                <>
                  <TableHead>S/N</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns ? (
                    columns.map((col, i) => (
                      <TableCell key={i}>
                        {col.Cell ? col.Cell({ 
                          value: item[col.accessor], 
                          item: item,
                          cell: { row: { index: index } },
                          state: { pageIndex: page - 1, pageSize: rowsPerPage }
                        }) : item[col.accessor]}
                      </TableCell>
                    ))
                  ) : (
                    <>
                      <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{item.reference}</div>
                        <div className="text-xs text-muted-foreground">{item.certificate_number}</div>
                      </TableCell>
                      <TableCell>{item.investment_type}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: item.currency || 'NGN',
                          minimumFractionDigits: 0,
                        }).format(item.amount)}
                      </TableCell>
                      <TableCell>{item.start_date}</TableCell>
                      <TableCell>{item.maturity_date}</TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns ? columns.length : 7} className="text-center py-10 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
