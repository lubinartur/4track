'use client';

import { motion } from 'framer-motion';

interface ActionIconButtonProps {
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
  title: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export default function ActionIconButton({
  onClick,
  ariaLabel,
  title,
  icon,
  variant = 'default',
}: ActionIconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`h-10 w-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-center ${
        variant === 'destructive'
          ? 'text-white/80 hover:bg-black/70 hover:text-red-300'
          : 'text-white/80 hover:bg-black/70 hover:text-white'
      }`}
      aria-label={ariaLabel}
      title={title}
      whileHover={{ scale: 1.05, opacity: 1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {icon}
    </motion.button>
  );
}
