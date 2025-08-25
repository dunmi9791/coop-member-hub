import { Card } from "@/components/ui/card";
import ShareTable from "@/components/ui/data-table";
import { Link } from "react-router-dom";

const BoughtShares =()=>{
    return (
         <Card className="p-5 rounded-xl">
             <div className="flex justify-end">
                        <Link to='invest' className="apply-btn my-3">Invest</Link>
                    </div>
        <ShareTable/>
        </Card>
    )
}
export default BoughtShares;