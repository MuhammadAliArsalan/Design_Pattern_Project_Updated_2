import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Every Student in Pakistan",
    description:
      "StudySync is built to help students learn practical tech skills through structured courses, real projects, and a strong developer community focused on career growth.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Industry-Focused Curriculum",
    description:
      "Our courses are designed with real-world skills in mind so you can learn exactly what companies are looking for in 2026.",
  },
  {
    order: 2,
    heading: "Hands-on Learning Approach",
    description:
      "Learn by building projects, solving coding challenges, and applying concepts instead of just watching lectures.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Earn certificates after completing courses to showcase your skills and improve your job opportunities.",
  },
  {
    order: 4,
    heading: "Smart Evaluation System",
    description:
      "Get instant feedback on assignments and coding tasks to track your progress effectively.",
  },
  {
    order: 5,
    heading: "Job-Ready Skills",
    description:
      "Everything you learn is focused on helping you become job-ready for internships, freelancing, or full-time roles.",
  },
];

const LearningGrid = () => {

  return (
    <div className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "lg:col-span-2 lg:h-[294px]"}  ${card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                  ? "bg-richblack-800 h-[294px]"
                  : "bg-transparent"
              } ${card.order === 3 && "lg:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-3 pb-10 lg:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;