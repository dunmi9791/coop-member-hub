import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";

const SharesPurchaseRequests=()=>{
    // Demo data (replace with API data)
const shareData = [
  { id: 1, date: "2025-08-01", shareType: "Ordinary",   unit: 10, amount: 500,  status: "Active" },
  { id: 2, date: "2025-08-05", shareType: "Preference", unit: 20, amount: 1200, status: "Pending" },
  { id: 3, date: "2025-08-10", shareType: "Ordinary",   unit: 5,  amount: 250,  status: "Active" },
  { id: 4, date: "2025-08-12", shareType: "Preference", unit: 15, amount: 900,  status: "Closed" },
  { id: 5, date: "2025-08-15", shareType: "Ordinary",   unit: 30, amount: 1500, status: "Approved" },
  { id: 6, date: "2025-08-18", shareType: "Preference", unit: 8,  amount: 400,  status: "Rejected" },
]
    return (
         <Card className="p-5 rounded-xl">
        <DataTable shareData={shareData}/>
        </Card>
    )
}
export default SharesPurchaseRequests;