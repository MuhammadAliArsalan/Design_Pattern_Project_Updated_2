import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"

import { motion } from 'framer-motion'
import { fadeIn } from '../../common/motionFrameVarients';

const timeline = [
  {
    Logo: Logo1,
    heading: "Career-Focused Learning",
    Description:
      "Gain practical skills that align with real-world industry demands and help you grow professionally.",
  },
  {
    Logo: Logo2,
    heading: "Student-Centered Experience",
    Description:
      "Every feature is designed to make learning simple, engaging, and effective for students at all levels.",
  },
  {
    Logo: Logo3,
    heading: "Flexible Learning",
    Description:
      "Study anytime, anywhere with structured courses that adapt to your schedule and pace.",
  },
  {
    Logo: Logo4,
    heading: "Hands-on Practice",
    Description:
      "Work on real projects and challenges to build strong problem-solving and practical development skills.",
  },
];

const TimelineSection = () => {
  return (
    <div className="max-w-maxContent mx-auto py-20">

      <motion.div
        variants={fadeIn('right', 0.1)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: false, amount: 0.1 }}
        className='relative max-w-6xl mx-auto'
      >

        {/* Vertical Line */}
        <div className="absolute left-[24px] top-0 h-full w-[2px] bg-white/10"></div>

        <div className="flex flex-col gap-12">
          {timeline.map((element, index) => (
            <div key={index} className='flex items-start gap-6 group'>

              {/* ICON */}
              <div className='relative z-10 min-w-[48px] h-[48px] rounded-full bg-white/10 backdrop-blur-md flex justify-center items-center border border-white/20 group-hover:scale-110 transition'>
                <img src={element.Logo} alt="logo" className="w-5 h-5" />
              </div>

              {/* CONTENT */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 w-full">
                <h2 className='font-semibold text-lg text-white mb-2'>
                  {element.heading}
                </h2>
                <p className='text-sm text-richblack-300 leading-relaxed'>
                  {element.Description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </motion.div>
    </div>
  )
}

export default TimelineSection