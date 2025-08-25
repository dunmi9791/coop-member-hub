import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Input {
    shareType: string,
    shareUnit: number,
    amount: number
}
interface Shares {
    typeName: string,
    shareCode: number
}
const BuyShares = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState<Input | null>(null);
    const [shareTypes, setShareTypes] = useState<Shares[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInput({ ...input, [name]: value })
    }
    return (
        <div className="mt-3 border rounded-[18px] border-[#043d73] bg-[#fff]" >
            <div
                className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
                style={{
                    backgroundColor: "",
                    borderRadius: "15px 15px 0 0",
                }}
            >
                <div className="subtitle text-white flex gap-1 items-center">
                    <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" /> Make investment</div>
            </div>
            <div className="selected-items-container p-3 py-5">
                <div className="input-container">
                    <label htmlFor="shareType">
                        Share type<sup className="text-red-700">*</sup>
                    </label>
                    <select
                        name="shareType"
                        required
                        onChange={handleChange}
                    >
                        <option value="">Select type</option>
                        {shareTypes.map((product) => (
                            <option value={product.shareCode} key={product.shareCode}>
                                {product.typeName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-container">
                    <label htmlFor="shareUnit">
                        Loan amount<sup className="text-red-700">*</sup>
                    </label>
                    {/* <NumericFormat */}
                    {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
                    <input
                        name="shareUnit"
                        required
                        onChange={handleChange}
                        type='number'
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="amount">
                        Share amount<sup className="text-red-700">*</sup>
                    </label>
                    {/* <NumericFormat */}
                    {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
                    <input
                        name="amount"
                        required
                        onChange={handleChange}
                        type='number'
                        disabled
                    />
                </div>

            </div>
            <div className="p-3">
                <div className="selected-items-container">
                    <div
                        className="rounded-[16px] mt-3 border border-[#043d73]">
                        <div
                            className="p-3 form-header  bg-[#043d73] rounded-t-[15px]">
                            <div className="subtitle text-white">Investment type info</div>
                        </div>
                        <div className="p-3 text-[14px]">
                       <div className="flex gap-3 mt-2"> Investment price:</div>
                       <div className="flex gap-3 mt-2"> Total purchase value:</div>
                       <div className="flex gap-3 mt-2"> Max available units:</div>
                       <div className="flex gap-3 mt-2">Share Description:</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 bg-[#1985B3] p-5 mt-4 rounded-b-[17px]">
                <button className="apply-btn">Buy</button>
                <button className="discard-btn">Discard</button>
            </div>
        </div>
    )
}
export default BuyShares;