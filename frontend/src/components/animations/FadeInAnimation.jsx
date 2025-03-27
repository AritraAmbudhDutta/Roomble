import React, { useState } from "react";
import { motion } from "framer-motion";

const FadeInAnimation = ({ children }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const variants = {
    hidden: { opacity: 0, translateY: 30 },
    visible: { opacity: 1, translateY: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={hasAnimated ? "visible" : undefined} // Only animate if it hasn't already
      whileInView={!hasAnimated ? "visible" : undefined} // Trigger animation only once
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => setHasAnimated(true)} // Mark animation as completed
    >
      {children}
    </motion.div>
  );
};

export default FadeInAnimation;