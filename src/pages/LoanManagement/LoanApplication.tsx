import { Wallet, TrendingUp, CreditCard, Calculator, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input';
import api from '@/hooks/api';
import { UserContext } from '@/hooks/AuthContext';
import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { NumericFormat } from 'react-number-format';

const LoanApplication = () => {
interface Products{
    id: number;
    name: string
}

interface BankAccount {
    id: number;
    acc_number: string;
    account_holder_name: string;
    bank_name: string;
    bank_bic: string;
    currency_id: number;
    currency_name: string;
    partner_id: number;
    partner_name: string;
}

interface Input{
    loanAmount: number | null,
    type_id: number | null,
    duration: number | null,
    latest_payslip: string | null,
    payout_option: 'pay_to_coop_saving' | 'pay_to_bank_account' | null,
    payout_bank_id: number | null,
}
  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState <Input>({
    loanAmount: null,
    type_id: null,
    duration: null,
    latest_payslip: null,
    payout_option: null,
    payout_bank_id: null,
  });
  const [products, setProducts] = useState<Products[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const {credentials} = useContext(UserContext)
  const navigate = useNavigate();

const handleChange =(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const name = e.target.name;
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the prefix (e.g., "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      setInput({ ...input, [name]: base64 });
    };
    reader.readAsDataURL(file);
  } else {
    setInput({ ...input, [name]: null });
  }
};

   const fetchProducts = async()=>{
      const payload={
        jsonrpc:'2',
        method: 'call',
        id:1,
        params:{}
      }
      await api.post('/api/portal/loan_types', payload).then(resp=>setProducts(resp.data.result.loan_types))
    }

    const fetchBankAccounts = async () => {
      try {
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          id: 1,
          params: {
            partner_id: credentials?.partner_id,
          }
        }
        const resp = await api.post('/api/portal/bank_accounts', payload)
        if (resp.data.result?.success) {
          setBankAccounts(resp.data.result.data)
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error)
      }
    }

  useEffect(()=>{
  fetchProducts()
  if (credentials?.partner_id) {
    fetchBankAccounts()
  }
  }, [credentials])
  

  const onSubmit = async(e)=>{
    e.preventDefault()

    if (!credentials?.partner_id) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    const payload ={
      jsonrpc: '2.0',
      method: 'call',
      params: {
        partner_id: Number(credentials.partner_id),
        type_id: Number(input.type_id),
        amount: input.loanAmount,
        duration: Number(input.duration),
        latest_payslip: input.latest_payslip,
        payout_option: input.payout_option,
        payout_bank_id: input.payout_option === 'pay_to_bank_account' ? Number(input.payout_bank_id) : null,
      }
    }
    try {
      const resp = await api.post('/api/portal/new_loan', payload)
      const result = resp.data.result;
      
      // The API might return { ok: false, error: "..." } or similar
      const isOk = result?.ok !== false && (result?.status === 'success' || !result?.status);
      const errorMessage = result?.error || result?.message || 'Notice';

      if (isOk) {
        setSubmitting(false);
        navigate('/dashboard/loans/result', { 
          state: { 
            status: 'success', 
            message: result?.message || 'Loan application was successful',
            details: {
              loanAmount: input.loanAmount,
              duration: input.duration,
            }
          } 
        });
      } else {
        setSubmitting(false);
        navigate('/dashboard/loans/result', { 
          state: { 
            status: 'error', 
            message: errorMessage,
            error: errorMessage
          } 
        });
      }
    } catch (error: any) {
      setSubmitting(false);
      const errorMessage = error.response?.data?.error?.message || 
                           error.response?.data?.message || 
                           error.message || 
                           "An error occurred during loan application";
      
      navigate('/dashboard/loans/result', { 
        state: { 
          status: 'error', 
          message: 'Error!',
          error: errorMessage
        } 
      });
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
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setInput({ ...input, loanAmount: floatValue || null });
                }}
                value={input.loanAmount ?? ''}
              />
            </div>
            <div className="input-container">
                <label htmlFor="duration">
                  Loan duration (months)<sup className="text-red-700">*</sup>{" "}
                </label>
              <input type="number" name="duration" onChange={handleChange} value={input.duration ?? ''} required />
            </div>
            <div className="input-container">
              <label htmlFor="payout_option">
                Payout option<sup className="text-red-700">*</sup>
              </label>
              <select
                name="payout_option"
                required
                onChange={handleChange}
                value={input.payout_option ?? ''}
              >
                <option value="">Select payout option</option>
                <option value="pay_to_coop_saving">Pay to coop savings</option>
                <option value="pay_to_bank_account">Pay to bank account</option>
              </select>
            </div>
            {input.payout_option === 'pay_to_bank_account' && (
              <div className="input-container">
                <label htmlFor="payout_bank_id">
                  Bank account<sup className="text-red-700">*</sup>
                </label>
                <select
                  name="payout_bank_id"
                  required
                  onChange={handleChange}
                  value={input.payout_bank_id ?? ''}
                >
                  <option value="">Select bank account</option>
                  {bankAccounts.map((account) => (
                    <option value={account.id} key={account.id}>
                      {account.bank_name} - {account.acc_number}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="input-container">
              <label htmlFor="latest_payslip">
                Latest payslip (JPEG, PNG, or PDF)<sup className="text-red-700">*</sup>
              </label>
              <input 
                type="file" 
                name="latest_payslip" 
                required
                onChange={handleFileChange} 
                accept=".jpg,.jpeg,.png,.pdf" 
              />
            </div>
        </div>
          <div className="flex justify-end gap-5 p-5 bg-[#1985B3] rounded-b-[18px]">
          <button type="submit" className='apply-btn' disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Apply'
            )}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/loans')} className='discard-btn' disabled={submitting}>Discard</button>
        </div>
      </div>
      </form>
    </>
    )}
export default LoanApplication