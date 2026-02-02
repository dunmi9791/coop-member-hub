import { Input } from '@/components/ui/input';
import api from '@/hooks/api';
import { UserContext } from '@/hooks/AuthContext';
import React, {useState, useEffect, useContext} from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "@/components/ui/use-toast"
import { NumericFormat } from 'react-number-format';

const LoanApplication = () => {
interface Products{
    productCode: number;
    productName: string
}

interface Frequency{
    freqCode: number;
    freqName: string
}
interface Input{
    loanAmount: number | null,
    type_id: number,
}
  const [input, setInput] = useState <Input>({
    loanAmount: null,
    type_id: null
  });
  const [products, setProducts] = useState<Products[]>([]);
  const [frequencies, setFrequencies] = useState([]);
  const {credentials} = useContext(UserContext)
  const [detail, setDetail] = useState({
    frequency:'',
    duration:'',
    interestRate:''
  });
  const [schedules, setSchedules] = useState([]);

const handleChange =(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
}

const totalInterest = schedules?.reduce(
    (sum, schedule) => sum + schedule.interest,
    0
  );

  function getOrdinalSuffix(num) {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  }

   const fetchProducts = async()=>{
      const payload={
        jsonrpc:'2',
        method: 'call',
        id:1,
        params:{}
      }
      await api.post('/odoo/api/portal/loan_types', payload).then(resp=>setProducts(resp.data.result.loan_types))
    }
  useEffect(()=>{
  fetchProducts()
  }, [])
  

  const onSubmit = async(e)=>{
    e.preventDefault()
    const payload ={
      partner_id: Number(credentials?.result?.partner_id),
      type_id: input.type_id,
      amount: input.loanAmount
    }
    try {
       await api.post('/odoo/api/portal/new_loan', payload)
      toast({ 
      title: "Success!",
      description: 'Loan application was successful',
      variant: "default"
      })
      setInput({
        loanAmount: null,
        type_id: null
      })
    } catch (error) {
      toast({
    title: "Error!",
    description: error.response.data.message,
    variant: "destructive",
    })
    }
  }

  return (
<>
<form onSubmit={onSubmit}>
        <div className="mt-3 border  rounded-[18px] border-[#043d73] bg-[#fff]" >
          <div
            className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle text-white">Loan application</div>
          </div>
          <div className="selected-items-container px-4 py-5">
            <div className="input-container">
              <label htmlFor="loanProduct">
                Loan product<sup className="text-red-700">*</sup>
              </label>
              <select
                name="type_id"
                required
                onChange={handleChange}
                value={input.type_id ?? ''}
              >
                <option value="">Select product</option>
                {products.map((product:any) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="loanAmount">
                Loan amount<sup className="text-red-700">*</sup>
              </label>
              {/* <NumericFormat */}
                {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
                <NumericFormat
                name="loanAmount"
                thousandSeparator
                required
                onChange={handleChange}
                value={input.loanAmount ?? ''}
              />
            </div>
            <div className="input-container">
              <label htmlFor="frequency">
                Frequency<sup className="text-red-700">*</sup>
              </label>
              <select
                name="frequency"
                disabled
                value={detail?.frequency}
              >
                <option value="">Select frequency</option>
                {frequencies.map((frequency) => (
                  <option value={frequency.freqCode} key={frequency.freqCode}>
                    {frequency.freqName}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container">
                <label htmlFor="duration">
                  Loan duration (months)<sup className="text-red-700">*</sup>{" "}
                </label>
              <input type="number" name="duration" onChange={handleChange} />
            </div>
            <div className="input-container">
              <label htmlFor="interestRate">
                Interest rate<sup className="text-red-700">*</sup>
              </label>
              <input
                type="text"
                name="interestRate"
                value={detail?.interestRate}
                readOnly
                disabled
              />
            </div>
            <div className="input-container">
              <label htmlFor="interestLoanAmount">
                Loan amount upon interest<sup className="text-red-700">*</sup>
              </label>
              {/* <NumericFormat
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true} */}
                <input
                name="interestLoanAmount"
                readOnly
                disabled
                // value={new Intl.NumberFormat("en-US", {
                //   minimumFractionDigits: 2,
                // }).format(
                //   // Number(input?.loanAmount?.replace(/,/g, "")) + totalInterest
                // )}
              />
            </div>
        </div>
        <div className="flex justify-end gap-5 p-5 bg-[#1985B3] rounded-b-[18px]">
          <button className='apply-btn'>Apply</button>
          <button className='discard-btn'>Discard</button>
        </div>
      </div>
      </form>
    </>
    )}
export default LoanApplication