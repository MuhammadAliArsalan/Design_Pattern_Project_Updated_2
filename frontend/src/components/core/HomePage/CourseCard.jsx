import React from "react";
import { motion } from "framer-motion";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      className="group relative cursor-pointer rounded-2xl p-8 border backdrop-blur-xl
      bg-richblack-800/60 border-richblack-700
      hover:border-caribbeangreen-500 transition-all duration-300"
    >
      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-caribbeangreen-500/10 to-blue-500/10"></div>

      {/* ACTIVE DOT */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-caribbeangreen-400 rounded-full opacity-0 group-hover:opacity-100 transition"></div>

      {/* CONTENT */}
      <div className="relative flex flex-col gap-4">

        {/* TITLE */}
        <h3 className="text-lg font-semibold text-white group-hover:text-caribbeangreen-100 transition">
          {cardData?.heading}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-richblack-300 leading-relaxed">
          {cardData?.description}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center text-sm text-richblack-300">

          <div className="flex items-center gap-2">
            <HiUsers className="text-caribbeangreen-400" />
            <span>{cardData?.level}</span>
          </div>

          <div className="flex items-center gap-2">
            <ImTree className="text-blue-400" />
            <span>{cardData?.lessionNumber} Lessons</span>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default CourseCard;