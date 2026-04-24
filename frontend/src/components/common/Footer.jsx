import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#000814] border-t border-blue-900/20 pt-16 pb-8 text-white">
      <div className="mx-auto w-11/12 max-w-maxContent">

        {/* Upper Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

          {/* Brand Column - Text Logo */}
          <div className="lg:w-[30%] flex flex-col gap-6">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-white flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-md">SS</div>
              StudySync
            </Link>
            <p className="text-slate-300 leading-relaxed text-sm">
              The world's most comprehensive online learning platform. Join millions of learners and unlock your potential with our expert-led courses.
            </p>
            <div className="flex gap-5 text-white/70">
              <FaFacebook className="cursor-pointer hover:text-blue-400 transition-all text-xl" />
              <FaGoogle className="cursor-pointer hover:text-blue-400 transition-all text-xl" />
              <FaTwitter className="cursor-pointer hover:text-blue-400 transition-all text-xl" />
              <FaYoutube className="cursor-pointer hover:text-blue-400 transition-all text-xl" />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:w-[60%] grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Quick Link</h4>
              <div className="flex flex-col gap-3 text-slate-400 text-sm">
                <Link to="/" className="hover:text-white transition-all">Home</Link>
                <Link to="/about" className="hover:text-white transition-all">About</Link>
                <Link to="/contact" className="hover:text-white transition-all">Contact</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Category</h4>
              <div className="flex flex-col gap-3 text-slate-400 text-sm">
                <Link to="/category/web-development" className="hover:text-white transition-all">Web Development</Link>
                <Link to="/category/mobile-app-development" className="hover:text-white transition-all">Mobile App Development</Link>
                <Link to="/category/programming" className="hover:text-white transition-all">Programming</Link>
                <Link to="/category/devops" className="hover:text-white transition-all">DevOps</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">
                Contact
              </h4>
              <div className="flex flex-col gap-3 text-slate-400 text-sm">
                <a
                  href="mailto:support@studynotion.com"
                  className="hover:text-white transition-all flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Get in touch
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-[12px] text-slate-500 tracking-widest font-medium">
          <div className="flex gap-8">
            <span>Copyright © 2026 StudySync. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;