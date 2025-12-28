import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
};

export function Button({ label, variant = "primary", onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-white",
        variant === "secondary" &&
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400 focus:ring-offset-white"
      )}
    >
      {label}
    </button>
  );
}
