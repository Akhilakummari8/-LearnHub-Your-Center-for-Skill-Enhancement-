import { motion } from "framer-motion";

const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

const PageTransitionWrapper = ({ children }) => {
  return (
    <motion.div
      initial={fadeScaleVariants.initial}
      animate={fadeScaleVariants.animate}
      exit={fadeScaleVariants.exit}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitionWrapper;
