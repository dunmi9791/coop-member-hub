import React, {useState, useEffect} from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const LoanCalculator = () => {
interface Products{
    productCode: number;
    productName: string
}

interface Frequency{
    freqCode: number;
    freqName: string
}
interface Input{
    loanAmount: string,
    duration: number,
}
  const [input, setInput] = useState <Input |null>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [frequencies, setFrequencies] = useState([]);
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

  return (
    <div>
        LoanCalculator
<form>
        <div className="rounded-4 mt-3" style={{ border: "solid 1px #f7f4f7" }}>
          <div
            className="p-3 form-header bg-[#f4fAfd] rounded"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle">Loan calculator</div>
          </div>
          <div className="selected-items-container p-3">
            <div className="input-container">
              <label htmlFor="loanProduct">
                Loan product<sup className="text-danger">*</sup>
              </label>
              <select
                name="product"
                required
                onChange={handleChange}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option value={product.productCode} key={product.productCode}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="loanAmount">
                Loan amount<sup className="text-danger">*</sup>
              </label>
              {/* <NumericFormat */}
                {/* // thousandSeparator={true}
                // decimalScale={2}
                // fixedDecimalScale={true} */}
                <input
                name="loanAmount"
                required
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <label htmlFor="frequency">
                Frequency<sup className="text-danger">*</sup>
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
                  Loan duration (months)<sup className="text-danger">*</sup>{" "}
                </label>
              <input type="number" name="duration" onChange={handleChange} value={input?.duration}/>
            </div>
            <div className="input-container">
              <label htmlFor="interestRate">
                Interest rate<sup className="text-danger">*</sup>
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
                Loan amount upon interest<sup className="text-danger">*</sup>
              </label>
              {/* <NumericFormat
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true} */}
                <input
                name="interestLoanAmount"
                readOnly
                disabled
                value={new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                }).format(
                  Number(input?.loanAmount?.replace(/,/g, "")) + totalInterest
                )}
              />
            </div>
          </div>
        </div>
        {/* Loan repayment breakdown */}
        <div className="rounded-4 mt-3" style={{ border: "solid 1px #f7f4f7" }}>
          <div
            className="p-3 form-header"
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle">
              Loan application /Loan repayment breakdown
            </div>
          </div>
          <div className="p-3">
            <div className="selected-items-container">
              <div
                className="rounded-4 mt-3"
                style={{ border: "solid 1px #f7f4f7" }}
              >
                <div
                  className="p-3 form-header"
                  style={{
                    backgroundColor: "#f4fAfd",
                    borderRadius: "15px 15px 0 0",
                  }}
                >
                  <div className="subtitle">Loan repayment breakdown</div>
                </div>
                <div className="p-3 d-flex flex-column gap-3">
                  {schedules?.map((schedule, i) => {
                    const position = i + 1;
                    const progress = (position / input?.duration) * 100;
                    return (
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                          <div style={{ width: 50 }}>
                            <CircularProgressbar
                              value={progress}
                              strokeWidth={50}
                              styles={buildStyles({
                                strokeLinecap: "butt",
                              })}
                            />
                          </div>
                          <div className="d-flex flex-column">
                            <span>
                              {position}
                              {getOrdinalSuffix(position)} loan payment
                            </span>
                            <span>
                              {" "}
                              Due by{" "}
                              {new Date(schedule.date).toLocaleDateString(
                                "en-CA"
                              )}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontWeight: "500", color: "#333333" }}>
                          NGN{" "}
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                          }).format(schedule.total)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoanCalculator