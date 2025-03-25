import React from "react";
import { motion } from "framer-motion";

const FadeInAnimation = ({ children }) => {
  const variants = {
    hidden: { opacity: 0, translateY: 30, scale: 0 },
    visible: { opacity: 1, translateY: 0, scale: 1 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView={"visible"}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};
export default FadeInAnimation;
