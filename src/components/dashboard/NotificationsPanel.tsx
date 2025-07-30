import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "action";
  title: string;
  message: string;
  time: string;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Savings Goal Achieved",
    message: "Congratulations! You've reached your target savings of ₦500,000",
    time: "2 hours ago"
  },
  {
    id: "2", 
    type: "action",
    title: "Loan Payment Due",
    message: "Your monthly loan payment of ₦15,000 is due in 3 days",
    time: "1 day ago",
    actionLabel: "Pay Now"
  },
  {
    id: "3",
    type: "info",
    title: "New Investment Option",
    message: "Agricultural bonds with 12% annual returns now available",
    time: "3 days ago",
    actionLabel: "Learn More"
  }
];

export function NotificationsPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
      case "action":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
      case "action":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {notifications.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-smooth"
          >
            <div className={`p-1 rounded-full ${
              notification.type === "success" ? "text-success" :
              notification.type === "action" ? "text-accent" : "text-primary"
            }`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {notification.time}
                </span>
                {notification.actionLabel && (
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    {notification.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}