import {  ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewShare =()=>{
    const navigate = useNavigate()
    return (
        
          <div className="mt-3 border rounded-[18px] border-[#043d73]" >
          <div
            className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle text-white flex gap-1 items-center">
                <ArrowLeft onClick={()=>navigate(-1)} className="cursor-pointer"/> View investment request</div>
          </div>
        </div>
    )
}
export default ViewShare;