import { MoveLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const RescheduleSavings = () => {
  const navigate = useNavigate()


const onSubmit =()=>{

} 
  return (
       <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Savings</h1>
        <p className="text-muted-foreground">Reschedule Savings Amount</p>

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
              <MoveLeft onClick={()=>navigate(-1)} className="cursor-pointer"/> Reschedule Savings Amount
            </div>
          </div>
          <div className="selected-items-container px-4 py-5">
             <div className="input-container">
              <label htmlFor="amount">
                Old amount
              </label>
              <input type="text" />
            </div>
             <div className="input-container">
              <label htmlFor="amount">
                New amount
              </label>
              <input type="text" />
            </div>
        </div>
        <div className="flex justify-end gap-5 p-5 bg-[#1985B3] rounded-b-[18px] mt-5">
            <button className="apply-btn">Proceed</button>
            <button className="discard-btn">Discard</button>
          </div>
        </div>
        </form>
        </div>
  )
}

export default RescheduleSavings