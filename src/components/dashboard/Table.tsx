import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { LiaTimesCircle } from "react-icons/lia";

interface TableProps {
  columns: any[];
  data: any[];
  pageCount: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const CustomTable: React.FC<TableProps> = ({
  columns,
  data,
  pageCount: controlledPageCount,
  pageNumber,
  setPageNumber,
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: controlledPageCount,
    state: {
      globalFilter,
      pagination: {
        pageIndex: pageNumber,
        pageSize: 10,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {/* 🔍 Search */}
      <div className="d-flex align-items-center my-3">
        <form className="input-container my-2 w-100 ">
          <input
            type="text"
            placeholder="Search anything"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 search-field w-100"
          />
        </form>
      </div>

      {/* 🧾 Table */}
      <div className="table-responsive">
        <table id="customers" className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: "pointer",
                      border: "solid 1px #e6e6e6",
                      borderRadius: "5px 5px 0 0",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {data.length > 0 ? (
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <div className="d-flex flex-column justify-content-center">
                    <LiaTimesCircle size={30} className="text-center mx-auto" />
                    <p className="text-center">No record yet</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* 📄 Pagination */}
      {data.length > 0 && (
        <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
          <button
            onClick={() => setPageNumber(0)}
            disabled={pageNumber === 0}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
          >
            {"<<"}
          </button>

          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
            disabled={pageNumber === 0}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
          >
            {"<"}
          </button>

          <span>
            Page{" "}
            <strong>
              {pageNumber + 1} of {controlledPageCount}
            </strong>
          </span>

          <button
            onClick={() =>
              setPageNumber((prev) =>
                Math.min(prev + 1, controlledPageCount - 1)
              )
            }
            disabled={pageNumber >= controlledPageCount - 1}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
          >
            {">"}
          </button>

          <button
            onClick={() => setPageNumber(controlledPageCount - 1)}
            disabled={pageNumber >= controlledPageCount - 1}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
          >
            {">>"}
          </button>
        </div>
      )}
    </>
  );
};

export default CustomTable;
