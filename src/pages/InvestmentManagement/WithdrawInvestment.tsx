import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WithdrawInvestment = () => {
  interface Products {
    productCode: number;
    productName: string;
  }

  interface Input {
    loanAmount: string;
    duration: number;
  }
  const [input, setInput] = useState<Input | null>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [frequencies, setFrequencies] = useState([]);
  const [detail, setDetail] = useState({
    frequency: "",
    duration: "",
    interestRate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const navigate = useNavigate()
  return (
    <>
      <form>
        <div className="mt-3 border rounded-[18px] border-[#043d73] bg-[#fff]">
          <div
            className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle text-white flex gap-2 items-center">
                <ArrowLeft onClick={()=>navigate(-1)} className="cursor-pointer"/> Investment withdrawal</div>
          </div>
          <div className="selected-items-container p-3 py-5">
            <div className="input-container">
              <label htmlFor="shareType">
                Investment type<sup className="text-red-700">*</sup>
              </label>
              <select name="shareType" required onChange={handleChange}>
                <option value="">Select product</option>
                {products.map((product) => (
                  <option value={product.productCode} key={product.productCode}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="loanAmount">Units of investment purchased</label>
              {/* <NumericFormat */}
              {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
              <input
                name="shareUnit"
                required
                onChange={handleChange}
                type="number"
                disabled
              />
            </div>
            <div className="input-container">
              <label htmlFor="loanAmount">
                Current investment total amount
              </label>
              {/* <NumericFormat */}
              {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
              <input
                name="totalAmount"
                required
                onChange={handleChange}
                type="number"
                disabled
              />
            </div>
               <div className="input-container">
              <label htmlFor="shareType">
                Select receiving account<sup className="text-red-700">*</sup>
              </label>
              <select name="shareType" required onChange={handleChange}>
                <option value="">Select account</option>
                {products.map((product) => (
                  <option value={product.productCode} key={product.productCode}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="selected-items-container p-3">
            <div className="rounded-[16px] mt-3 border border-[#043d73]">
              <div className="p-3 form-header  bg-[#043d73] rounded-t-[15px]">
                <div className="subtitle text-white">
                  Investment information
                </div>
              </div>
            <div className="p-3 gap-3">
             <div className="mt-2"> <span>Current share price: </span> {''}</div>
              <div className="mt-2"><span>Total purchased amount: </span> {''}</div>
              <div className="mt-2"><span>Total withdrawn amount:  </span>{''} </div>
            </div>
            </div>
          </div>
          <div className="flex justify-end mt-3 items-center gap-3 p-5 bg-[#1985B3] rounded-b-[18px]">
            <button className="apply-btn">Proceed</button>
            <button className="discard-btn">Discard</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default WithdrawInvestment;
