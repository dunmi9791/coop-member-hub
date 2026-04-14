import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import DataTable, { StatusBadge } from "@/components/ui/data-table";
import { Link } from "react-router-dom";
import { UserContext } from "@/hooks/AuthContext";
import api from "@/hooks/api";
import { Loader2, Settings2 } from "lucide-react";
import InvestmentActionModal from "./InvestmentActionModal";
import { Button } from "@/components/ui/button";

const BoughtShares = () => {
  const { credentials } = useContext(UserContext);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionClick = (investment: any) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const payload = {
          jsonrpc: "2.0",
          method: "call",
          params: {
            member_id: credentials?.partner_id,
          },
          id: 1,
        };
        const resp = await api.post("/api/portal/member_investments/", payload);
        if (resp.data.result && resp.data.result.investments) {
          setInvestments(resp.data.result.investments);
        }
      } catch (error) {
        console.error("Error fetching investments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (credentials?.partner_id) {
      fetchInvestments();
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
      Header: "Start Date",
      accessor: "start_date",
    },
    {
      Header: "Maturity Date",
      accessor: "maturity_date",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: any) => <StatusBadge status={value} />,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ item }: any) => (
        item.status?.toLowerCase() === "active" ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-primary hover:text-primary/80"
            onClick={() => handleActionClick(item)}
          >
            <Settings2 className="h-4 w-4" />
            <span>Manage</span>
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <Card className="p-5 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Investment Portfolio</h2>
        <Link to="invest" className="apply-btn">
          Invest
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable data={investments} columns={columns} />
      )}

      <InvestmentActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investment={selectedInvestment}
      />
    </Card>
  );
};

export default BoughtShares;