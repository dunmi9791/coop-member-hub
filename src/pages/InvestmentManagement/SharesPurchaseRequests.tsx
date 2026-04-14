import { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import DataTable, { StatusBadge } from "@/components/ui/data-table";
import { UserContext } from "@/hooks/AuthContext";
import api from "@/hooks/api";
import { Loader2 } from "lucide-react";

const SharesPurchaseRequests = () => {
  const { credentials } = useContext(UserContext);
  const [investmentRequests, setInvestmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestmentRequests = async () => {
      try {
        const payload = {
          jsonrpc: "2.0",
          method: "call",
          params: {
            member_id: credentials?.partner_id,
          },
          id: 1,
        };
        const resp = await api.post("/api/portal/member_investments_request/", payload);
        if (resp.data.result && resp.data.result.requests) {
          setInvestmentRequests(resp.data.result.requests);
        }
      } catch (error) {
        console.error("Error fetching investment requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (credentials?.partner_id) {
      fetchInvestmentRequests();
    } else {
      setLoading(false);
    }
  }, [credentials]);

  const columns = [
    {
      Header: "S/N",
      accessor: "id",
      Cell: ({ cell }: any) => <span>{cell.row.index + 1}</span>,
    },
    {
      Header: "Reference",
      accessor: "reference",
      Cell: ({ value, item }: any) => (
        <div>
          <div className="font-medium text-primary">{value}</div>
          <div className="text-xs text-muted-foreground">{item?.certificate_number}</div>
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "investment_type",
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value, item }: any) => (
        <span>
          {new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: item?.currency || 'NGN',
            minimumFractionDigits: 0,
          }).format(value)}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "start_date",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: any) => <StatusBadge status={value} />,
    },
  ];

  return (
    <Card className="p-5 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Investment Purchase Requests</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable data={investmentRequests} columns={columns} />
      )}
    </Card>
  );
};

export default SharesPurchaseRequests;