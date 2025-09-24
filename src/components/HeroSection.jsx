import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="main-hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="hero-overline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          MORE THAN AN AI CAREER ADVISOR
        </motion.div>
        <motion.h1
          className="hero-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Discover your <br /> perfect career path
        </motion.h1>
        <motion.p
          className="hero-subtext"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          With our AI-powered platform, you can explore, analyze, and optimize your career journey. Get personalized guidance, skill gap analysis, and curated resources—built just for Indian students.
        </motion.p>
        <motion.button
          className="hero-btn"
          whileHover={{ scale: 1.07, backgroundColor: "#2851be" }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320 }}
        >
          Start building
        </motion.button>
      </motion.div>
    </section>
  );
}
