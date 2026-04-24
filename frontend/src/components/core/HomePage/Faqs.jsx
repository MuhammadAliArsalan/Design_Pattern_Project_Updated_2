import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqsData = [
  {
    question: "What is StudySync?",
    answer:
      "StudySync is a structured learning platform designed to help you learn in a guided, project-based way with real-world skills.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
        "Simply browse our course catalog, select a course that interests you, and process payment to get instant access to all the course materials and start learning right away.",
  },
  {
    question: "Can I access my courses on mobile?",
    answer:
      "Yes, you can access your courses on any device with a web browser.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely. All courses are self-paced so you can learn anytime, anywhere without pressure.",
  },
  {
    question: "How do I track my progress?",
    answer:
      "Your dashboard tracks progress, completed lessons, and course completion percentage in real-time.",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-11/12 max-w-maxContent mx-auto py-20 text-white">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold">
          Frequently Asked <span className="text-blue-50">Questions</span>
        </h2>
        <p className="text-richblack-100 mt-3">
          Everything you need to know before getting started
        </p>
      </div>

      {/* FAQ List */}
      <div className="flex flex-col gap-5 max-w-3xl mx-auto">
        {faqsData.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-richblack-700 rounded-2xl bg-richblack-800 overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-richblack-5 font-medium text-lg">
                  {faq.question}
                </span>

                <span className="text-blue-50 text-xl">
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </span>
              </button>

              {/* Answer with smooth animation */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-5 overflow-hidden"
                  >
                    <p className="text-richblack-100 pb-5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faqs;