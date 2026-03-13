import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import { Link } from "react-router-dom";
import { UserContext } from "@/hooks/AuthContext";
import api from "@/hooks/api";
import { Loader2 } from "lucide-react";

const BoughtShares = () => {
  const { credentials } = useContext(UserContext);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <DataTable data={investments} />
      )}
    </Card>
  );
};

export default BoughtShares;