
/**
 * FadeInAnimation Component
 * Wraps children with a fade-in animation effect using Framer Motion.
 *
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

const FadeInAnimation = ({ children }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animation variants for hidden and visible states
  const variants = {
    hidden: { opacity: 0, translateY: 30 },
    visible: { opacity: 1, translateY: 0 },
  };

  return (
    <motion.div
      variants={variants} 
      initial="hidden" 
      animate={hasAnimated ? "visible" : undefined} 
      whileInView={!hasAnimated ? "visible" : undefined}
      viewport={{ once: true, amount: 0.3 }} 
      transition={{ duration: 0.5, ease: "easeInOut" }} 
      onAnimationComplete={() => setHasAnimated(true)}
    >
      {children}
    </motion.div>
  );
};

export default FadeInAnimation;