import { createContext, useContext, useState, ReactNode } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  category: "system" | "order" | "security" | "project" | "delivery";
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nouvelle commande",
      message: "Commande CMD-2024-001 reçue de Chantier Azure",
      type: "info",
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      read: false,
      category: "order",
      actionUrl: "/supplier/orders",
      priority: "medium"
    },
    {
      id: "2",
      title: "Alerte sécurité",
      message: "Tentative d'accès non autorisé détectée",
      type: "warning",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      read: false,
      category: "security",
      actionUrl: "/security",
      priority: "high"
    },
    {
      id: "3",
      title: "Livraison programmée",
      message: "Votre commande sera livrée demain à 14h",
      type: "success",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      read: false,
      category: "delivery",
      actionUrl: "/delivery",
      priority: "low"
    },
    {
      id: "4",
      title: "Projet mis à jour",
      message: "Le projet Résidence Azure a été modifié",
      type: "info",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
      read: true,
      category: "project",
      actionUrl: "/projects",
      priority: "low"
    },
    {
      id: "5",
      title: "Maintenance système",
      message: "Maintenance programmée ce soir de 22h à 2h",
      type: "warning",
      timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
      read: true,
      category: "system",
      priority: "medium"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};