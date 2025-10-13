import { cn } from "@/lib/utils";
export function Badge({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <span className={cn("inline-flex items-center rounded-full bg-coast-100 px-3 py-1 text-xs font-medium text-coast-800", className)}>{children}</span>;
}
