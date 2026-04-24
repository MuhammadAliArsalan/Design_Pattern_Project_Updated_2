import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="relative border border-richblack-600 text-richblack-300 rounded-2xl p-6 lg:p-12 flex flex-col gap-6 bg-richblack-800/40 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300">

      {/* Glow background effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>

      {/* Heading */}
      <h1 className="text-3xl lg:text-4xl leading-tight font-semibold text-richblack-5">
        Have questions? don’t hesitate to contact us
      </h1>

      {/* Description */}
      <p className="text-richblack-200 text-sm lg:text-base leading-relaxed">
        We are passionate about transforming lives through education. Founded with a vision to make learning accessible to all, we believe in the power of knowledge to unlock opportunities and shape the future.
      </p>

      {/* Form */}
      <div className="mt-4">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;