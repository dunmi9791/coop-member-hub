import CustomTable from "@/components/dashboard/Table";
import React, { useEffect, useMemo, useState } from "react";

const ViewLoanRepayment = () => {
  const [input, setInput] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const columns = useMemo(
    () => [
      {
        id: "serial",
        header: "S/N",
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          return <span>{row.index + 1 + pageIndex * pageSize}</span>;
        },
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <span>
              {new Date(value).toLocaleDateString()}{" "}
              {new Date(value).toLocaleTimeString()}
            </span>
          );
        },
      },
      {
        header: "Account name",
        accessorKey: "accountName",
      },
      {
        header: "Amount",
        accessorKey: "accountBalance",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <span>
              NGN{" "}
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(value)}
            </span>
          );
        },
      },
      {
        header: "Payment mode",
        accessorKey: "paymentMode",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="d-flex justify-content-center">
              <div
                className={
                  value === "Cash"
                    ? "cash-mode"
                    : value === "Member bank account"
                    ? "member-mode"
                    : "cheque-mode"
                }
              >
                <hr /> <span>{value}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Charges",
        accessorKey: "charges",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <span>
              NGN{" "}
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(value)}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div
              className={
                value === "Pending"
                  ? "pending-status"
                  : value === "Posted"
                  ? "approved-status"
                  : "rejected-status"
              }
            >
              <hr /> <span>{value === "Posted" ? "Approved" : value}</span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="bg-white p-4 my-4 rounded-lg">
      <h3>Loan Repayment</h3>
      <CustomTable
        columns={columns}
        data={data}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageCount={pageCount}
      />
    </div>
  );
};

export default ViewLoanRepayment;
