import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FiTarget, FiZap, FiLayout } from "react-icons/fi" 

const LearningLanguageSection = () => {
    return (
            <div className="w-full bg-richblack-900 -mt-16">
            <div className='flex flex-col gap-8 items-center w-11/12 max-w-maxContent mx-auto'>

                {/* Heading */}
                <div className='text-4xl lg:text-6xl font-extrabold text-center tracking-tighter text-richblack-5 leading-[1.1]'>
                    Learn without limits. <br className="hidden lg:block" />
                    <HighlightText text={"Endless opportunity starts here."} />
                </div>

                <p className='text-center text-richblack-200 mx-auto text-lg font-medium lg:w-[60%] leading-relaxed'>
                    Beyond just lessons. We provide the tools to monitor your growth, 
                    compete with the best, and customize your curriculum. Your learning, your way.
                </p>

                {/* Feature Cards Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

  {/* Card 1 */}
  <div className="group p-8 rounded-3xl border border-richblack-700 bg-richblack-800 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2">
    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
      <FiTarget size={28} />
    </div>

    <h3 className="text-2xl font-bold text-richblack-5 mb-3">
      Structured Learning Paths
    </h3>

    <p className="text-richblack-300 font-medium">
      Follow a step-by-step curriculum designed to help you learn efficiently from basics to advanced concepts.
    </p>
  </div>

  {/* Card 2 */}
  <div className="group p-8 rounded-3xl border border-richblack-700 bg-richblack-800 shadow-lg hover:shadow-caribbeangreen-500/20 transition-all duration-300 hover:-translate-y-2">
    <div className="w-14 h-14 rounded-2xl bg-caribbeangreen-500/10 flex items-center justify-center text-caribbeangreen-300 mb-6 group-hover:bg-caribbeangreen-300 group-hover:text-black transition-all">
      <FiZap size={28} />
    </div>

    <h3 className="text-2xl font-bold text-richblack-5 mb-3">
      Hands-on Practice
    </h3>

    <p className="text-richblack-300 font-medium">
      Learn by doing with practical exercises, assignments, and real coding challenges.
    </p>
  </div>

  {/* Card 3 */}
  <div className="group p-8 rounded-3xl border border-richblack-700 bg-richblack-800 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2">
    <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-300 mb-6 group-hover:bg-pink-300 group-hover:text-black transition-all">
      <FiLayout size={28} />
    </div>

    <h3 className="text-2xl font-bold text-richblack-5 mb-3">
      Career-Focused Curriculum
    </h3>

    <p className="text-richblack-300 font-medium">
      Courses designed to match industry expectations and help you become job-ready.
    </p>
  </div>

</div>
            </div>
        </div>
    )
}

export default LearningLanguageSection