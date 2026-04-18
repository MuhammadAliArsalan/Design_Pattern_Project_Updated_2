import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"

import Footer from "../components/common/Footer"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import StatsComponenet from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"
import Img from "../components/common/Img"
import ReviewSlider from './../components/common/ReviewSlider';

import { motion } from 'framer-motion';
import { fadeIn } from "../components/common/motionFrameVarients"

const About = () => {
  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <motion.header
            className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]"
          >
            <motion.p
              variants={fadeIn('down', 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
            > Pushing the limits of Innovation in Online Education for a
              <HighlightText text={"Brighter Future of Pakistan"} />
            </motion.p>

            <motion.p>
              Driving Innovation in Online Education for a{" "}
              <HighlightText text={"Brighter Future"} />
            </motion.p>

            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              StudyNotion is a student-built platform started as a Final Year Project (FYP) with a simple goal — to make tech education in Pakistan more practical, accessible, and career-focused.
              Today, it has evolved into a learning platform that helps students build real-world skills, work on projects, and become job-ready.
            </p>
          </motion.header>

          <div className="sm:h-[70px] lg:h-[150px]"></div>

          <div className=" absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <Img src={BannerImage1} alt="" />
            <Img src={BannerImage2} alt="" />
            <Img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <motion.div
              variants={fadeIn('right', 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
              className="my-24 flex lg:w-[50%] flex-col gap-10">

              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Our Founding Story
              </h1>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                StudyNotion started as a Final Year Project (FYP) created by a group of passionate students who wanted to solve a real problem — the gap between academic education and industry skills in Pakistan.
              </p>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                During development, we realized that students needed more than just theory. They needed hands-on learning, real projects, and a clear path toward employment. That idea pushed us to turn our FYP into a full learning platform.
              </p>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                During development, we realized that students needed more than just theory. They needed hands-on learning, real projects, and a clear path toward employment. That idea pushed us to turn our FYP into a full learning platform.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn('left', 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
            >
              <Img
                src={FoundingStory}
                alt="FoundingStory"
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Our Vision
              </h1>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                To make high-quality tech education accessible, affordable, and practical for every student in Pakistan, regardless of background or location.
              </p>
            </div>

            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%]">
                Our Mission
              </h1>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our mission is to help students become job-ready developers by focusing on real-world skills, project-based learning, and a strong community.
                We aim to bridge the gap between learning and earning through structured education and practical experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />

      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

      {/* Reviws from Other Learner */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      {/* footer */}
      <Footer />
    </div>
  )
}

export default About