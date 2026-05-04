import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';

import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider'
import Course_Slider from '../components/core/Category/Course_Slider'

import { getCategoryPageData } from '../services/operations/pageAndComponentData'
import { getAllCourses } from '../services/operations/courseDetailsAPI'

import { MdOutlineRateReview } from 'react-icons/md'
import { FaArrowRight } from "react-icons/fa"

import { motion } from 'framer-motion'
import { fadeIn, } from './../components/common/motionFrameVarients';
import img1 from "../assets/Images/img1.png";
import Faqs from "../components/core/HomePage/Faqs";

// background random images
// import backgroundImg1 from '../assets/Images/random bg img/coding bg1.jpg'
// import backgroundImg2 from '../assets/Images/random bg img/coding bg2.jpg'
// import backgroundImg3 from '../assets/Images/random bg img/coding bg3.jpg'
// import backgroundImg4 from '../assets/Images/random bg img/coding bg4.jpg'
// import backgroundImg5 from '../assets/Images/random bg img/coding bg5.jpg'
// import backgroundImg6 from '../assets/Images/random bg img/coding bg6.jpeg'
// import backgroundImg7 from '../assets/Images/random bg img/coding bg7.jpg'
// import backgroundImg8 from '../assets/Images/random bg img/coding bg8.jpeg'
// import backgroundImg9 from '../assets/Images/random bg img/coding bg9.jpg'
// import backgroundImg10 from '../assets/Images/random bg img/coding bg10.jpg'
// import backgroundImg111 from '../assets/Images/random bg img/coding bg11.jpg'
import backgroundImg1 from '../assets/Images/random bg img/bg1.jpg'
import backgroundImg2 from '../assets/Images/random bg img/bg2.png'
import backgroundImg3 from '../assets/Images/random bg img/bg3.jpg'
import backgroundImg4 from '../assets/Images/random bg img/bg4.webp'
import backgroundImg5 from '../assets/Images/random bg img/bg5.webp'


// const randomImges = [
//     // backgroundImg1,
//     // backgroundImg2,
//     // backgroundImg3,
//     // backgroundImg4,
//     // backgroundImg5,
//     // backgroundImg6,
//     // backgroundImg7,
//     // backgroundImg8,
//     // backgroundImg9,
//     // backgroundImg10,
//     backgroundImg1,
//     backgroundImg2,
//     backgroundImg3,
//     backgroundImg4

// ]


const Home = () => {
    const images = [
        backgroundImg1,
        backgroundImg2,
        backgroundImg3,
        backgroundImg4,
        backgroundImg5
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    // get background random images
    // const [backgroundImg, setBackgroundImg] = useState(null);

    // useEffect(() => {
    //     const bg = randomImges[Math.floor(Math.random() * randomImges.length)]
    //     setBackgroundImg(bg);
    // }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // console.log('bg ==== ', backgroundImg)

    // get courses data
    const [CategoryPageData, setCategoryPageData] = useState(null);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [popularCourses, setPopularCourses] = useState([]);
    const categoryID = "6506c9dff191d7ffdb4a3fe2" // hard coded
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCategoryPageData = async () => {
            const result = await getCategoryPageData(categoryID, dispatch);
            setCategoryPageData(result);
        }
        if (categoryID) {
            fetchCategoryPageData();
        }
    }, [categoryID, dispatch]);

    useEffect(() => {
        const fetchCourseLists = async () => {
            const courses = await getAllCourses();
            if (courses?.length) {
                setRecommendedCourses(courses.slice(0, 8));
                setPopularCourses(
                    [...courses]
                        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                        .slice(0, 8),
                );
            }
        };

        fetchCourseLists();
    }, []);


    return (
        <React.Fragment>
            {/* background random image */}
            {/* <div>
                <div className="w-full h-[450px] md:h-[680px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover ">
                    <img src={backgroundImg} alt="Background"
                        className="w-full h-full object-cover "
                    />

                    <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
                </div>
            </div> */}
            <div className="w-full h-[450px] md:h-[680px] absolute top-0 left-0 opacity-[0.4] overflow-hidden">
                {/* LEFT ARROW */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20
  bg-white/40 hover:bg-black/60 text-white p-3 rounded-full
  transition-all"
                >
                    ❮
                </button>

                {/* RIGHT ARROW */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20
  bg-white/40 hover:bg-black/60 text-white p-3 rounded-full
  transition-all"
                >
                    ❯
                </button>

                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="background"
                        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out
        ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                    />
                ))}

                <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg"></div>
            </div>

            <div className=' '>
                {/*Section1  */}
                <div className='relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white '>

                    <Link to={"/signup"}>
                        <div className='z-0 group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                                        transition-all duration-200 hover:scale-95 w-fit'>
                            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                              transition-all duration-200 group-hover:bg-richblack-900'>
                                <p>Become an Instructor</p>
                                <FaArrowRight />
                            </div>
                        </div>

                    </Link>

                    <motion.div
                        variants={fadeIn('left', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className='text-center text-3xl lg:text-6xl font-semibold mt-7  '
                    >
                        Empowering Minds,
                        <HighlightText text={"Shaping Futures"} />
                    </motion.div>

                    <motion.div
                        variants={fadeIn('right', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className=' mt-4 w-[90%] text-center text-base lg:text-lg font-bold text-richblack-200'
                    >
                        Welcome to StudySync, where learning knows no bounds. Whether you're a student, professional, or lifelong learner...
                    </motion.div>


                    <div className='flex flex-row gap-7 mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-2'>
                                Get Started Now
                                <FaArrowRight />
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/login"}>
                            <div className='flex items-center gap-2'>
                                Browse Courses <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>
                </div>

                {/* animated code */}
                <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between py-24">

  {/* Heading */}
  <div className="text-center max-w-[800px] mb-14">
    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-10">
      Why Choose <HighlightText text={"StudySync"} />
    </h2>

    <p className="text-richblack-300 mt-4 text-lg font-medium leading-relaxed">
      Our Commitment to Excellence, Learn, Grow & Success.
    </p>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

    {/* CARD 1 */}
    <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
      hover:bg-white/10 transition-all duration-300">

      <div className="w-14 h-14 mb-6 rounded-xl bg-blue-500/10 flex items-center justify-center
        group-hover:bg-blue-500/20 transition">

        <span className="text-xl font-bold text-blue-400">9/10</span>
      </div>

      <h3 className="text-xl font-bold mb-2">Student Satisfaction</h3>

      <p className="text-richblack-100 text-sm leading-relaxed">
        Consistently rated for quality content and transformative learning experiences.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
      hover:bg-white/10 transition-all duration-300">

      <div className="w-14 h-14 mb-6 rounded-xl bg-caribbeangreen-500/10 flex items-center justify-center
        group-hover:bg-caribbeangreen-500/20 transition">

        <span className="text-xl font-bold text-caribbeangreen-300">97%</span>
      </div>

      <h3 className="text-xl font-bold mb-2">Completion Rate</h3>

      <p className="text-richblack-100 text-sm leading-relaxed">
        Guided learning paths and real projects keep students consistent till success.
      </p>
    </div>

    {/* CARD 3 */}
    <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
      hover:bg-white/10 transition-all duration-300">

      <div className="w-14 h-14 mb-6 rounded-xl bg-pink-500/10 flex items-center justify-center
        group-hover:bg-pink-500/20 transition">

        <svg xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-pink-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">

          <path strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold mb-2">Expert Mentorship</h3>

      <p className="text-richblack-300 text-sm leading-relaxed">
        Learn from industry professionals in a structured, real-world environment.
      </p>
    </div>


                        {/* Background Decorative Element */}
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent -z-10 blur-3xl'></div>
                    </div>

                    <div className='relative mx-auto flex flex-col lg:flex-row-reverse w-11/12 max-w-maxContent items-center justify-between gap-20 py-24'>

                        {/* Text Content */}
                        <div className='w-full lg:w-[50%] flex flex-col gap-8'>
                            <div className='text-4xl lg:text-5xl font-extrabold tracking-tighter text-white leading-[1.1]'>
                                Built for Students <br />
                                <HighlightText text={"Who Are Ready to Learn."} />
                            </div>

                            <p className='text-richblack-300 text-lg font-medium'>
                                We don't just provide content; we provide a launchpad. Our ecosystem is
                                designed to help you master complex skills through structured,
                                data-driven learning paths.
                            </p>

                            <div className='flex gap-7 mt-4'>
                                <CTAButton active={true} linkto={"/signup"}>
                                    Start Your Journey
                                </CTAButton>
                            </div>
                        </div>

                        {/* Visual Replacement (Instead of Code) */}
                        <div className='relative w-full lg:w-[450px] h-[400px]'>
                            {/* Background Glow */}
                            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full'></div>

                            {/* Stats Cards Stack */}
                            <div className='relative grid grid-cols-2 gap-4'>

                                {/* Card 1: Courses */}
                                <div className='p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'>
                                    <p className='text-blue-400 text-3xl font-bold'>500+</p>
                                    <p className='text-richblack-200 font-medium text-sm'>Specialized Courses</p>
                                </div>

                                {/* Card 2: Experts */}
                                <div className='mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'>
                                    <p className='text-caribbeangreen-300 text-3xl font-bold'>150+</p>
                                    <p className='text-richblack-200 font-medium text-sm'>Industry Experts</p>
                                </div>

                                {/* Card 3: Global Learners */}
                                <div className='-mt-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'>
                                    <p className='text-pink-400 text-3xl font-bold'>20k+</p>
                                    <p className='text-richblack-200 font-medium text-sm'>Active Learners</p>
                                </div>

                                {/* Card 4: Success */}
                                <div className='mt-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'>
                                    <p className='text-yellow-100 text-3xl font-bold'>92%</p>
                                    <p className='text-richblack-200 font-medium text-sm'>Career Transition</p>
                                </div>

                            </div>

                            {/* Floating Design Element */}
                            <div className='absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-blue-500/30 rounded-br-3xl'></div>
                            <div className='absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-blue-500/30 rounded-tl-3xl'></div>
                        </div>

                    </div>

                    {/* Code block 2 */}
                    <div className="text-center flex flex-col gap-3">
                        <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tighter">
                            Accelerate with <HighlightText text={"StudySync"} />
                        </h2>
                        <p className="text-richblack-200 text-lg max-w-[600px] mx-auto">
                            A structured path designed to help you learn, practice, and succeed.
                        </p>
                    </div>
                    <div className="w-11/12 max-w-maxContent mx-auto py-4 grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT SIDE - TIMELINE */}
                        <div>
                            <TimelineSection />
                        </div>

                        {/* RIGHT SIDE - IMAGE */}
                        <div className="relative flex justify-center">

                            {/* glow */}
                            <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>

                            <img
                                src={img1}
                                alt="learning"
                                className="relative rounded-2xl shadow-2xl w-full max-w-[450px]"
                            />
                        </div>

                    </div>

                    {/* course slider */}
                    <div className='mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
                        <h2 className='text-white mb-6 text-2xl '>
                            Recommended Courses for You
                        </h2>
                        <Course_Slider Courses={recommendedCourses.length ? recommendedCourses : CategoryPageData?.selectedCategory?.courses} />
                    </div>
                    <div className=' mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
                        <h2 className='text-white mb-6 text-2xl '>
                            Popular Courses
                        </h2>
                        <Course_Slider Courses={popularCourses.length ? popularCourses : CategoryPageData?.mostSellingCourses} />
                    </div>

                    <ExploreMore />
                </div>

                {/*Section 2  */}
                <div className="min-h-screen bg-richblack-900 text-richblack-5">

                    <section className="py-20">
                        <div className="mx-auto w-11/12 max-w-maxContent">
                            <LearningLanguageSection />
                        </div>
                    </section>

                </div>


                {/*Section 3 */}
                <div className='mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
                    <InstructorSection />

                    {/* Reviws from Other Learner */}
                    <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
                        What Our Learners Say
                    </h1>
                    <ReviewSlider />
                </div>

                <Faqs />

                {/*Footer */}
                <Footer />
            </div >
        </React.Fragment>
    )
}

export default Home
