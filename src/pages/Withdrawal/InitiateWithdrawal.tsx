import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import { MoveLeft } from "lucide-react";
import { useContext, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast"


interface Input {
  account: string;
  amount: number;
  reason: string;
}

const InitiateWithdrawal = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [modes, setModes] = useState<any[]>([]);
  const [input, setInput] = useState<Input>({
    account: "",
    amount: null,
    reason: "",
  });
  const {details} = useContext(UserContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload={
      savings_account_id: input.account,
      amount: input.amount,
      reason: input.reason
    }
    try{
   const resp= await api.post('/odoo/api/portal/dashboard', payload, {headers:{
    }})
   toast({ 
      title: "Success!",
      description: 'Withdrawal application was successful',
      variant: "default"
      })
      setInput({
        ...input,
        amount: null,
       reason : null
      })
      setTimeout(() => {
        navigate(-1)
      }, 3000);
    } catch (error) {}
  };
  return (
    <>
      <form onSubmit={onSubmit} className="mt-4">
        <div className="mt-3 border  rounded-[18px] border-[#043d73] bg-[#fff]">
          <div
            className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle text-white flex gap-2 items-center">
                <MoveLeft onClick={()=>navigate(-1)} className="cursor-pointer"/> Initiate Withdrawal</div>
          </div>
          <div className="selected-items-container px-4 py-5">
            <div className="input-container">
              <label htmlFor="savings_account_id">
                Account number<sup className="text-red-700">*</sup>
              </label>
              <input
                name="savings_account_id"
                disabled
                value={details?.savings.primary_account_number}
             />
            </div>
            <div className="input-container">
              <label htmlFor="amount">
                Withdrawal amount<sup className="text-red-700">*</sup>
              </label>
              {/* <NumericFormat */}
              {/* // thousandSeparator={true}
                        // decimalScale={2}
                        // fixedDecimalScale={true} */}
              <NumericFormat
                name="amount"
                thousandSeparator
                required
                onChange={handleChange}
                value={input.amount ?? ""}
              />
            </div>
            <div className="input-container">
              <label htmlFor="reason">
                Reason<sup className="text-red-700">*</sup>
              </label>
              <textarea
              name="reason"
               value={input?.reason}
               onChange={handleChange}
              >
              
              </textarea>
            </div>
          </div>
        <div className="selected-items-container my-3 p-3 bg-white align-items-start">
          <div
            className="rounded-4 mt-3"
            style={{ border: "solid 1px #043d73", borderRadius:'15px 15px 0 0' }}
          >
            <div
              className="p-3 form-header"
              style={{
                backgroundColor: "#043d73",
                borderRadius: "15px 15px 0 0",
              }}
            >
              <div className="subtitle text-white">
                Account information</div>
            </div>
            <div className="d-flex flex-column p-3 gap-3">
              <div className="d-flex gap-3">
                <span className="key">Current account balance: </span>
                {/* <span className="value" style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US',
                       {minimumFractionDigits:2}).format(detail?.accountBalance)}</span> */}
              </div>
            </div>
          </div>
        </div>
           <div className="flex justify-end gap-5 p-5 bg-[#1985B3] rounded-b-[18px] mt-5">
            <button className='apply-btn'>Proceed</button>
            <button className='discard-btn'>Discard</button>
          </div>
        </div>
      </form>
    </>
  );
};
export default InitiateWithdrawal;
