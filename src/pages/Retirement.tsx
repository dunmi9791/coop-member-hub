import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

interface Input {}
const Retirement = () => {
  const [mode, setMode] = useState<string>("");

  const onSubmit = async () => {
    try {
    } catch (error) {}
  };
  return (
    <>
     <div className="my-4">
        <h1 className="text-3xl font-bold text-foreground">Retirement</h1>
        <p className="text-muted-foreground">Initiate Retirement</p>
      </div>
      <form onSubmit={onSubmit} className="my-8">
        <div className="mt-3 border  rounded-[18px] border-[#043d73] bg-[#fff]">
          <div
            className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
            style={{
              backgroundColor: "",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div className="subtitle text-white flex gap-2 items-center">
              Initiate Retirement
            </div>
          </div>
          <div className="selected-items-container px-4 py-5">
             <div className="input-container">
              <label htmlFor="amount">
                Amount
              </label>
              <NumericFormat
                name="amount"
                thousandSeparator
                required
                readOnly
                // value={detail.amount ?? ""}
              />
            </div>
            <div className="input-container">
              <label htmlFor="mode">
                Payment mode<sup className="text-red-700">*</sup>
              </label>
              <select
                name="mode"
                required
                onChange={(e)=>setMode(e.target.value)}
                value={mode ?? ""}
              >
                <option value="">Select account number</option>
              
              </select>
            </div>
           
          </div>
          <div className="selected-items-container my-3 p-3 bg-white align-items-start">
            <div
              className="rounded-4 mt-3"
              style={{
                border: "solid 1px #043d73",
                borderRadius: "15px 15px 0 0",
              }}
            >
              <div
                className="p-3 form-header"
                style={{
                  backgroundColor: "#043d73",
                  borderRadius: "15px 15px 0 0",
                }}
              >
                <div className="subtitle text-white">Account information</div>
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
            <button className="apply-btn">Proceed</button>
            <button className="discard-btn">Discard</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Retirement;
