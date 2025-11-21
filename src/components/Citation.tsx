import { cn } from "@/lib/utils";

interface CitationProps {
  number: number;
  onClick: () => void;
  className?: string;
}

export const Citation = ({ number, onClick, className }: CitationProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center",
        "w-6 h-6 mx-1",
        "text-xs font-semibold",
        "bg-primary text-primary-foreground",
        "rounded border border-primary",
        "transition-all duration-200",
        "hover:bg-primary/90 hover:scale-110",
        "active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {number}
    </button>
  );
};
