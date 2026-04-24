import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../components/common/motionFrameVarients";

import FoundingStory from "../assets/Images/Founding.png";
import BannerImage1 from "../assets/Images/about1.png";
import BannerImage2 from "../assets/Images/about2.png";
import BannerImage3 from "../assets/Images/about3.png";
import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";
import HighlightText from "../components/core/HomePage/HighlightText";

const GlassCard = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.3 }}
    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-6"
  >
    {children}
  </motion.div>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-richblack-900 text-white overflow-hidden">

      {/* ================= HERO ================= */}
<section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
  {/* Ambient background glow */}
  <div className="absolute inset-0">
    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full" />
    <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
    <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-white/5 blur-[120px] rounded-full" />
  </div>

  {/* subtle grid overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-center max-w-4xl relative z-10"
  >

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-md tracking-widest text-richblack-400 uppercase"
    >
      About Our Platform
    </motion.p>

    <h1 className="mt-4 text-5xl md:text-6xl font-bold leading-tight">
      Learn Today. <HighlightText text={"Lead Tomorrow."} />
    </h1>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-5 text-richblack-100 text-2xl md:text-2xl max-w-2xl mx-auto"
    >
      Built by students, for students... focused on real skills, real projects, and real careers.
    </motion.p>
  </motion.div>

</section>

      {/* ================= IMAGE GRID ================= */}
      <section className="w-11/12 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 relative z-10">

        {[BannerImage1, BannerImage2, BannerImage3].map((img, i) => (
          <GlassCard key={i}>
            <img
              src={img}
              className="h-60 w-full object-cover rounded-xl opacity-90 hover:opacity-100 transition"
              alt=""
            />
          </GlassCard>
        ))}

      </section>

      {/* ================= STORY ================= */}
      <section className="w-11/12 max-w-6xl mx-auto py-24 grid md:grid-cols-2 gap-10 items-center">

        <motion.div variants={fadeIn("right", 0.2)} initial="hidden" whileInView="show">

          <h2 className="text-5xl font-bold mb-6">
            Our <HighlightText text={"Journey"} />
          </h2>

          <GlassCard>
            <p className="text-richblack-100 leading-relaxed">
              What started as a small student idea is now evolving into a full-scale learning platform focused on bridging the gap between education and industry demands.
            </p>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <GlassCard>
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-richblack-300 text-sm">Active Learners</p>
            </GlassCard>

            <GlassCard>
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-richblack-300 text-sm">Success Rate</p>
            </GlassCard>

          </div>

        </motion.div>

        <motion.div variants={fadeIn("left", 0.2)} initial="hidden" whileInView="show">
          <GlassCard>
            <img src={FoundingStory} className="rounded-xl w-full" />
          </GlassCard>
        </motion.div>

      </section>

      {/* ================= PROBLEM → SOLUTION ================= */}
<section className="w-11/12 max-w-6xl mx-auto py-24 grid md:grid-cols-2 gap-8">

  <motion.div whileHover={{ scale: 1.02 }}>
    <GlassCard>
      <h3 className="text-xl font-semibold text-red-400 mb-4">
        The Problem
      </h3>

      <p className="text-richblack-300 leading-relaxed">
        Traditional education often fails to equip students with the practical skills
        and real-world experience needed to succeed in the tech industry,
        creating a clear gap between learning and employment.
      </p>

      <p className="text-richblack-400 mt-3 text-sm leading-relaxed">
        Most graduates struggle to apply theoretical knowledge in real-world projects,
        leaving them underprepared for industry expectations.
      </p>
    </GlassCard>
  </motion.div>

  <motion.div whileHover={{ scale: 1.02 }}>
    <GlassCard>
      <h3 className="text-xl font-semibold text-green-400 mb-4">
        Our Solution
      </h3>

      <p className="text-richblack-300 leading-relaxed">
        We focus on project-based learning, real-world simulations, and mentorship-driven growth
        to ensure students learn by doing, not just reading.
      </p>

      <p className="text-richblack-400 mt-3 text-sm leading-relaxed">
        Students graduate with job-ready skills, strong portfolios, and industry confidence
        that directly translates into career opportunities.
      </p>
    </GlassCard>
  </motion.div>

</section>

      {/* ================= VISION / MISSION ================= */}
      <section className="w-11/12 max-w-6xl mx-auto pb-24 grid md:grid-cols-2 gap-6">

        <GlassCard>
          <h3 className="text-xl font-semibold mb-3">Vision</h3>
          <p className="text-richblack-300">
            Make tech education accessible, practical, and career-driven for everyone. Our vision is to empower the next generation of developers with real-world skills and opportunities, transforming education into a launchpad for successful tech careers.
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold mb-3">Mission</h3>
          <p className="text-richblack-300">
          Turn learners into job-ready developers through real-world projects and mentorship. Our mission is to provide a practical, hands-on learning experience that equips students with the skills and confidence needed to succeed in the tech industry.
          </p>
        </GlassCard>

      </section>

      {/* ================= CTA STRIP ================= */}
      <section className="w-11/12 max-w-6xl mx-auto pb-24 text-center">

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <h2 className="text-3xl font-bold">
            Ready to start your journey?
          </h2>
          <p className="text-richblack-300 mt-3">
            Join thousands of learners building real careers.
          </p>

         <button
  onClick={() => navigate("/signup")}
  className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:scale-105 transition"
>
  Get Started
</button>
        </motion.div>

      </section>

      <Footer />
    </div>
  );
};

export default About;