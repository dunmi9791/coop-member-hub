import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinancialCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  icon: ReactNode;
  count: number | undefined;
  variant?: "default" | "success" | "warning" | "accent";
  trend?: "up" | "down" | "neutral";
  className?: string;
  children?: ReactNode;
}

export function FinancialCard({
  title,
  amount,
  subtitle,
  icon,
  count,
  variant = "default",
  trend = "neutral",
  className,
  children
}: FinancialCardProps) {
  const variantStyles = {
    default: "bg-gradient-card shadow-card border-border/50",
    success: "bg-gradient-success shadow-success text-success-foreground",
    warning: "bg-gradient-accent shadow-card text-accent-foreground",
    accent: "bg-gradient-primary shadow-elevated text-primary-foreground"
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-smooth hover:shadow-elevated hover:scale-[1.02]",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className={cn(
          "text-sm font-medium tracking-wide uppercase",
          variant === "default" ? "text-muted-foreground" : "text-current opacity-90"
        )}>
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "default" ? "bg-primary/10 text-primary" : "bg-white/20 text-current"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">
            { amount ? new Intl.NumberFormat('en-US', 
            {minimumFractionDigits:2}).format(amount) : count}</span>
          {trend !== "neutral" && (
            <span className={cn("text-sm font-medium", trendColors[trend])}>
              {trend === "up" ? "↑" : "↓"}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={cn(
            "text-sm",
            variant === "default" ? "text-muted-foreground" : "text-current opacity-75"
          )}>
            {subtitle}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}