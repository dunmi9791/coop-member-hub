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

interface NotificationsPanelProps {
  notifications?: {
    unread_count: number;
    items: any[];
  };
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
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

  const notificationItems = notifications?.items || [];
  const unreadCount = notifications?.unread_count || 0;

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {unreadCount} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications at this time</p>
          </div>
        ) : (
          notificationItems.map((notification, index) => (
            <div
              key={notification.id || index}
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
          ))
        )}
      </CardContent>
    </Card>
  );
}