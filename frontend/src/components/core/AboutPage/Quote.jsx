import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
      We are on a mission to make{" "}
      <span className="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] text-transparent bg-clip-text font-bold">
        quality tech education
      </span>{" "}
      accessible to every student in Pakistan.

      <br /><br />

      Our platform <HighlightText text={"combines modern technology"} />,{" "}
      real-world skills, and a strong developer community to help you{" "}
      
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
        learn faster
      </span>
      , build projects, and{" "}
      
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        land your first tech job.
      </span>
    </div>
  )
}

export default Quote