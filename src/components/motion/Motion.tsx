'use client';

import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

// Page fade transition wrapper
interface PageFadeProps {
  children: ReactNode;
}

export function PageFade({ children }: PageFadeProps) {
  const shouldReduceMotion = useFramerReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1], // easeOut
      }}
    >
      {children}
    </motion.div>
  );
}

// Fade up animation for sections/blocks
interface FadeUpProps {
  children: ReactNode;
  delay?: number;
}

export function FadeUp({ children, delay = 0 }: FadeUpProps) {
  const shouldReduceMotion = useFramerReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for lists/grids
interface StaggerProps {
  children: ReactNode;
}

export function Stagger({ children }: StaggerProps) {
  const shouldReduceMotion = useFramerReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.05,
            staggerChildren: 0.04,
          },
        },
      }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}

// Stagger item for individual cards
interface StaggerItemProps {
  children: ReactNode;
}

export function StaggerItem({ children }: StaggerItemProps) {
  const shouldReduceMotion = useFramerReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.985,
          y: 10,
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
