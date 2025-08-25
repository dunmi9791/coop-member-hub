import { Card } from "@/components/ui/card";
import ShareTable from "@/components/ui/data-table";
import { Link } from "react-router-dom";

const SharesWithdrawalRequests=()=>{

    return(
       <Card className="p-5 rounded-xl">
        <div className="flex justify-end">
            <Link to='withdraw-investment' className="apply-btn my-3">Withdraw</Link>
        </div>
        <ShareTable/>
        </Card>
    )
}
export default SharesWithdrawalRequests;