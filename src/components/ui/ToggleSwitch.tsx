"use client";

import { motion } from "motion/react";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  label: string;
}

export default function ToggleSwitch({
  enabled,
  onToggle,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          enabled ? "bg-rose" : "bg-rose-light/50"
        }`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <span className="text-sm text-rose-dark/80 group-hover:text-rose-dark transition-colors">
        {label}
      </span>
    </button>
  );
}
