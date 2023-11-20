import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Leaf from '../../public/leaf.svg';

const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 5000); // Duration before moving upwards, adjust as needed
        return () => clearTimeout(timer);
    }, []);

    // Background variants
    const backgroundVariants = {
        initial: { opacity: 1 },
        animate: { opacity: 0 },
    };

    // Logo variants for the beating effect
    const logoBeatVariants = {
        beat: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } }
    };

    // Logo transition to navbar
    const logoTransitionVariants = {
        initial: { y: 0, scale: 1 },
        animate: { y: '-50vh', scale: 0.5, transition: { duration: 1, ease: 'easeInOut' } },
    };

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
                    style={{height: '100vh', width: '100vw'}}
                    variants={backgroundVariants}
                    initial="initial"
                    animate={showSplash ? 'initial' : 'animate'}
                    exit="animate"
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <motion.img
                        src={Leaf}
                        alt="Logo"
                        className="h-32 w-32" // Adjust the size as needed
                        variants={showSplash ? logoBeatVariants : logoTransitionVariants}
                        initial="initial"
                        animate="beat"
                        onAnimationComplete={() => setShowSplash(false)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;