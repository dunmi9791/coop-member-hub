import React from "react"
import { MdLocationOn } from "react-icons/md"
import { Link } from "react-router-dom"
import { LuPhoneCall } from "react-icons/lu"
import { BsEnvelopeOpen } from "react-icons/bs"

const ContactUs = () => {
  return (
    
       <div className="py-6">
        {/* Header */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center bg-[#043d73] rounded-t-2xl">
            <div className="text-white font-medium">Profile settings</div>
          </div>
        {/* Body */}
        <div className="grid gap-6 sm:grid-cols-3 py-6 px-4">
          {/* Visit us */}
          <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <MdLocationOn size={30} className="text-blue-500" />
            <h4 className="text-lg font-semibold text-gray-800">Visit us</h4>
            <p className="text-sm text-gray-600">Visit our office HQ in Lekki</p>
            <Link
              to=""
              className="text-sm text-blue-600 hover:underline"
            >
              View on Google Map
            </Link>
          </div>

          {/* Call us */}
          <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <LuPhoneCall size={30} className="text-green-500" />
            <h4 className="text-lg font-semibold text-gray-800">Give us a call</h4>
            <p className="text-sm text-gray-600">Call us @ +2348188789836</p>
            <a
              href="tel:+2348188789836"
              className="text-sm text-green-600 hover:underline"
            >
              Call us now
            </a>
          </div>

          {/* Email us */}
          <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <BsEnvelopeOpen size={30} className="text-red-500" />
            <h4 className="text-lg font-semibold text-gray-800">Send us a mail</h4>
            <p className="text-sm text-gray-600">
              Send us a mail on{" "}
              <span className="text-xs">ucp.support@cwg-plc.com</span>
            </p>
            <a
              href="mailto:ucp.support@cwg-plc.com"
              className="text-sm text-red-600 hover:underline"
            >
              Email us now
            </a>
          </div>
        </div>
      </div>
      </div>
    
  )
}

export default ContactUs
