import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: "primary" | "secondary" | "accent";
  onClick?: () => void;
  className?: string;
}

export function ActionButton({
  title,
  description,
  icon,
  variant = "primary",
  onClick,
  className
}: ActionButtonProps) {
  const variantStyles = {
    primary: "bg-gradient-primary hover:shadow-elevated border-primary/20",
    secondary: "bg-gradient-card hover:bg-secondary border-border shadow-card",
    accent: "bg-gradient-accent hover:shadow-elevated border-accent/20"
  };

  const textStyles = {
    primary: "text-primary-foreground",
    secondary: "text-foreground",
    accent: "text-accent-foreground"
  };

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto p-6 flex flex-col items-start gap-3 text-left transition-smooth hover:scale-[1.02]",
        variantStyles[variant],
        textStyles[variant],
        className
      )}
    >
      <div className={cn(
        "p-3 rounded-lg",
        variant === "secondary" ? "bg-primary/10 text-primary" : "bg-white/20"
      )}>
        {icon}
      </div>
      <div className="space-y-1">
        <h3  className={cn(
    "font-semibold text-lg leading-tight",
    variant === "secondary"
      ? "text-foreground hover:text-foreground"
      : "text-primary-foreground hover:text-primary-foreground"
  )}>{title}</h3>
        <p className={cn(
          "text-sm leading-relaxed break-words whitespace-normal",
          variant === "secondary" ? "text-muted-foreground" : "opacity-75"
        )}>
          {description}
        </p>
      </div>
    </Button>
  );
}