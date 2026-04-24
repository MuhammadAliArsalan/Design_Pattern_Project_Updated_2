import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Live Support Chat",
    description: "Get instant help from our support team in Karachi.",
    details: "support@studysync.pk",
  },
  {
    icon: "BiWorld",
    heading: "Our Office",
    description: "We’re based in Karachi and always happy to meet learners.",
    details:
      "Block 5, Gulshan-e-Iqbal, Near Disco Bakery, Karachi, Pakistan",
  },
  {
    icon: "IoCall",
    heading: "Phone Support",
    description: "Available Monday to Friday, 9:00 AM – 6:00 PM (PKT).",
    details: "+92 321 200 7013",
  },
]

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-richblack-800 p-5 lg:p-7 shadow-lg">

      {contactDetails.map((ele, i) => {
        const Icon =
          Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]

        return (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-xl bg-richblack-700/40 hover:bg-richblack-700 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-richblack-600 text-blue-50 shrink-0">
              {Icon && <Icon size={22} />}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-richblack-5">
                {ele.heading}
              </h1>

              <p className="text-sm text-richblack-200">
                {ele.description}
              </p>

              <p className="text-sm font-medium text-richblack-100 break-words">
                {ele.details}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails