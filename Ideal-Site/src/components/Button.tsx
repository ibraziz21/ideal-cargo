import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  as?: "a" | "button" | "link";
};

export function Button({ href, onClick, children, variant = "primary", className, as = "button" }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition";
  const styles = {
    primary: "bg-coral text-white hover:opacity-95 shadow-soft",
    ghost: "text-ink hover:bg-coast-50",
    outline: "border border-ink/10 text-ink hover:bg-white"
  }[variant];

  if (as === "link" && href) {
    return <Link href={href} className={cn(base, styles, className)}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={cn(base, styles, className)}>{children}</a>;
  }
  return <button onClick={onClick} className={cn(base, styles, className)}>{children}</button>;
}
