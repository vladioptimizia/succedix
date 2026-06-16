import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = "h-11 px-6 rounded-full font-medium text-sm transition-all inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary: "",
    secondary: "",
    ghost: "",
  };

  const styles: Record<Variant, React.CSSProperties> = {
    primary: { background: '#10b981', color: '#fff', boxShadow: '0 0 16px rgba(16,185,129,0.25)' },
    secondary: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' },
    ghost: { background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#9ca3af' },
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={styles[variant]}
      {...props}
    />
  );
}
