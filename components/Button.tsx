import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-success text-white hover:bg-emerald-600",
  secondary: "bg-gray-700 text-white hover:bg-gray-600",
  ghost: "bg-transparent border border-gray-500 text-white hover:bg-gray-800",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`h-12 px-6 rounded-full font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
