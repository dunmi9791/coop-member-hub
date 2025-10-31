import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  amount?: string;
  time: string;
  type?: "contribution" | "withdrawal" | "loan_disbursement" | "investment";
}

export function ActivityItem({
  icon,
  title,
  description,
  amount,
  time,
  type = "contribution"
}: ActivityItemProps) {
  const typeStyles = {
    contribution: "text-success bg-success-light",
    withdrawal: "text-destructive bg-destructive/10", 
    loan_disbursement: "text-primary bg-primary-glow",
    investment: "text-accent bg-accent-light"
  };

  const amountStyles = {
    contribution: "text-success",
    withdrawal: "text-destructive",
    loan_disbursement: "text-primary", 
    investment: "text-accent"
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-smooth">
      <div className={cn(
        "flex-shrink-0 p-2 rounded-lg",
        typeStyles[type]
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm leading-tight">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{time}</p>
      </div>
      {amount && (
        <div className={cn(
          "text-sm font-semibold",
          amountStyles[type]
        )}>
          {amount}
        </div>
      )}
    </div>
  );
}