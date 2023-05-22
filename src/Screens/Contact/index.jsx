import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="banner_area">
            <div className="banner_inner d-flex align-items-center">
              <div className="container">
                <div className="banner_content text-center">
                  <h2>Contact Us</h2>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Contact;
