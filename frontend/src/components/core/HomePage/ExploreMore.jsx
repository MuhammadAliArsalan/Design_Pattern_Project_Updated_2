import React, { useState } from "react";
import { motion } from "framer-motion";
import { HomePageExplore } from "../../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const ExploreMore = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentData = HomePageExplore[activeIndex];

  return (
    <section className="w-11/12 max-w-maxContent mx-auto py-28 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
          Discover Modern <HighlightText text={"Learning Paths"} />
        </h2>

        <p className="mt-5 text-richblack-200 text-lg max-w mx-auto">
          Welcome to our diverse and dynamic course catalog. we're dedicated to providing you...
        </p>
      </motion.div>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-3 mb-14">
        {HomePageExplore.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-xl
              ${
                activeIndex === index
                  ? "bg-caribbeangreen-600 text-white border-caribbeangreen-400 shadow-lg shadow-caribbeangreen-900/30"
                  : "bg-richblack-800/70 text-richblack-200 border-richblack-700 hover:border-caribbeangreen-500"
              }`}
          >
            {item.tag}
          </motion.button>
        ))}
      </div>

      {/* TITLE */}
      <div className="text-center mb-10">
        <h3 className="text-2xl font-semibold text-white">
          {currentData?.tag}
        </h3>
        <p className="text-richblack-200 text-sm mt-2">
          Love what you see? Enroll now and start your journey towards mastering {currentData?.tag} with us!
          
        </p>
      </div>

      {/* CARDS */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {currentData?.courses?.map((course, index) => (
          <CourseCard
            key={index}
            cardData={course}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ExploreMore;