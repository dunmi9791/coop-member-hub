import * as React from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Loader2 } from "lucide-react"

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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchLoanStatement, formatMoney, LoanStatement as LoanStatementData } from "@/services/statementApi"

const TYPE_LABELS: Record<string, string> = {
  disbursement: "Disbursement",
  topup: "Top-up",
  repayment: "Repayment",
  interest: "Interest",
  adjustment: "Adjustment",
}

// Styled transaction type badge
function TypeBadge({ type }: { type: string }) {
  const style =
    type === "repayment"
      ? "bg-green-100 text-green-700 border border-green-200"
      : type === "disbursement" || type === "topup"
      ? "bg-blue-100 text-blue-700 border border-blue-200"
      : type === "interest"
      ? "bg-orange-100 text-orange-700 border border-orange-200"
      : "bg-gray-100 text-gray-700 border border-gray-200"

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {TYPE_LABELS[type] || type}
    </span>
  )
}

const selectClass =
  "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function LoanStatement() {
  const [statement, setStatement] = React.useState<LoanStatementData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [loanId, setLoanId] = React.useState<string>("")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 10

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLoanStatement(loanId ? Number(loanId) : undefined, {
        date_from: dateFrom,
        date_to: dateTo,
      })
      setStatement(data)
      // Reflect the backend's default loan choice in the selector
      if (!loanId && data.loan) setLoanId(String(data.loan.id))
    } catch (err) {
      setStatement(null)
      setError(err instanceof Error ? err.message : "Failed to load loan statement.")
    } finally {
      setLoading(false)
    }
  }, [loanId, dateFrom, dateTo])

  React.useEffect(() => {
    load()
  }, [load])

  React.useEffect(() => {
    setPage(1)
  }, [search, loanId, dateFrom, dateTo])

  const symbol = statement?.currency?.symbol || "₦"
  const transactions = statement?.transactions || []

  // Newest first on screen; the running balance is computed oldest-first by the backend
  const filteredData = transactions
    .filter((item) =>
      search === "" ||
      [item.date, item.reference, item.description, TYPE_LABELS[item.type], item.debit, item.credit, item.balance]
        .some((val) => String(val ?? "").toLowerCase().includes(search.toLowerCase()))
    )
    .slice()
    .reverse()

  const pageCount = Math.ceil(filteredData.length / rowsPerPage) || 1
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const exportPDF = () => {
    if (!statement?.loan) return
    // jsPDF's built-in fonts have no ₦ glyph, so the PDF uses the currency code
    const money = (v: number) => formatMoney(v, `${statement.currency.name} `)
    const loan = statement.loan
    const doc: any = new jsPDF()

    doc.setFontSize(18)
    doc.text("Loan Statement", 14, 20)

    doc.setFontSize(11)
    doc.text(`Name: ${statement.member.name}`, 14, 30)
    doc.text(`Member ID: ${statement.member.member_id || "-"}`, 14, 36)
    doc.text(`Loan: ${loan.name} (${loan.type})   Rate: ${loan.apr_percent ?? "-"}% p.a.`, 14, 42)
    doc.text(
      `Period: ${statement.date_from || loan.start_date || "Start"} to ${statement.date_to || new Date().toISOString().slice(0, 10)}`,
      14,
      48
    )
    doc.text(
      `Opening: ${money(statement.opening_balance)}   Debits: ${money(statement.total_debits)}   ` +
        `Credits: ${money(statement.total_credits)}   Closing: ${money(statement.closing_balance)}`,
      14,
      54
    )

    autoTable(doc, {
      head: [["Date", "Reference", "Description", "Type", "Debit", "Credit", "Balance"]],
      body: transactions.map((item) => [
        item.date,
        item.reference || "-",
        item.description,
        TYPE_LABELS[item.type] || item.type,
        item.debit ? money(item.debit) : "-",
        item.credit ? money(item.credit) : "-",
        money(item.balance),
      ]),
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [4, 61, 115] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(9)
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} - Page ${data.pageNumber} of ${pageCount}`,
          14,
          doc.internal.pageSize.height - 10
        )
      },
    })

    doc.save(`loan-statement-${loan.name || loan.id}.pdf`.replace(/[\\/]/g, "-"))
  }

  const hasLoans = (statement?.loans || []).length > 0

  return (
    <div className="mt-5 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between align-items-center">
          <h1 className="text-2xl font-bold text-gray-800">Loan statement</h1>
          <button
            onClick={exportPDF}
            disabled={!statement?.loan || transactions.length === 0}
            className="bg-[#043d73] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download as PDF
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-end">
          <label className="flex flex-col text-sm text-gray-600">
            Loan
            <select
              className={selectClass}
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              disabled={!hasLoans}
            >
              {!hasLoans && <option value="">No loans</option>}
              {(statement?.loans || []).map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.name} - {loan.type}{loan.state === "closed" ? " (closed)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm text-gray-600">
            From
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm text-gray-600">
            To
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </label>
          <Input
            placeholder="Search (reference, description, amount, date)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
        </div>

        {/* Summary */}
        {statement?.loan && !loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border p-3"><div className="text-gray-500">Opening balance</div><div className="font-semibold">{formatMoney(statement.opening_balance, symbol)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-gray-500">Total debits</div><div className="font-semibold text-red-500">{formatMoney(statement.total_debits, symbol)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-gray-500">Total credits</div><div className="font-semibold text-green-600">{formatMoney(statement.total_credits, symbol)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-gray-500">Closing balance</div><div className="font-semibold">{formatMoney(statement.closing_balance, symbol)}</div></div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">{error}</div>
        ) : !hasLoans ? (
          <div className="rounded-lg border p-6 text-center text-gray-500 text-sm">
            You have no disbursed loans yet, so there is no loan statement to show.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={`${item.date}-${item.reference}-${item.type}-${index}`}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      {item.description}
                      {item.reference && item.reference !== item.description && (
                        <div className="text-xs text-gray-500">{item.reference}</div>
                      )}
                    </TableCell>
                    <TableCell>{item.debit ? formatMoney(item.debit, symbol) : "-"}</TableCell>
                    <TableCell>{item.credit ? formatMoney(item.credit, symbol) : "-"}</TableCell>
                    <TableCell>{formatMoney(item.balance, symbol)}</TableCell>
                    <TableCell><TypeBadge type={item.type} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No transactions found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && !error && pageCount > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => { e.preventDefault(); setPage(i + 1) }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pageCount, p + 1)) }}
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
