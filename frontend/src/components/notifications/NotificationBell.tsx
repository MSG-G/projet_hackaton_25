import { useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Clock, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const { toast } = useToast();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security": return "bg-red-100 text-red-800";
      case "order": return "bg-blue-100 text-blue-800";
      case "delivery": return "bg-green-100 text-green-800";
      case "project": return "bg-purple-100 text-purple-800";
      case "system": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-red-500 bg-red-50";
      case "high": return "border-l-orange-500 bg-orange-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return "À l'instant";
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues.",
    });
  };

  const handleClearAll = () => {
    clearAll();
    setIsOpen(false);
    toast({
      title: "Notifications supprimées",
      description: "Toutes les notifications ont été supprimées.",
    });
  };

  // Sort notifications by timestamp (newest first) and priority
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Finally by timestamp
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="p-2">
                  {sortedNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${
                          getPriorityColor(notification.priority)
                        } ${
                          notification.read 
                            ? "hover:bg-muted/50" 
                            : "hover:bg-accent bg-accent/30"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${
                                  notification.read ? "text-muted-foreground" : "text-foreground"
                                }`}>
                                  {notification.title}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                                  {notification.category}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className={`text-sm ${
                              notification.read ? "text-muted-foreground" : "text-foreground"
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {getTimeAgo(notification.timestamp)}
                              </div>
                              {notification.actionUrl && (
                                <Link
                                  to={notification.actionUrl}
                                  className="text-xs text-primary hover:underline"
                                  onClick={() => setIsOpen(false)}
                                >
                                  Voir →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < sortedNotifications.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button variant="outline" className="w-full" size="sm">
                  Voir toutes les notifications
                </Button>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;