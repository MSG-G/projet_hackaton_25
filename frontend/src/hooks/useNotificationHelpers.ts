import { useNotifications } from "@/contexts/NotificationContext";

export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  const notifyOrderReceived = (orderNumber: string, clientName: string) => {
    addNotification({
      title: "Nouvelle commande reçue",
      message: `Commande ${orderNumber} de ${clientName}`,
      type: "info",
      category: "order",
      priority: "medium",
      actionUrl: "/supplier/orders"
    });
  };

  const notifySecurityAlert = (alertType: string, details: string) => {
    addNotification({
      title: "Alerte de sécurité",
      message: `${alertType}: ${details}`,
      type: "warning",
      category: "security",
      priority: "high",
      actionUrl: "/security"
    });
  };

  const notifyDeliveryUpdate = (status: string, orderNumber: string) => {
    addNotification({
      title: "Mise à jour livraison",
      message: `Commande ${orderNumber} - ${status}`,
      type: "success",
      category: "delivery",
      priority: "low",
      actionUrl: "/delivery"
    });
  };

  const notifyProjectUpdate = (projectName: string, updateType: string) => {
    addNotification({
      title: "Projet mis à jour",
      message: `${projectName} - ${updateType}`,
      type: "info",
      category: "project",
      priority: "medium",
      actionUrl: "/projects"
    });
  };

  const notifySystemMaintenance = (scheduledTime: string) => {
    addNotification({
      title: "Maintenance programmée",
      message: `Maintenance système prévue ${scheduledTime}`,
      type: "warning",
      category: "system",
      priority: "medium"
    });
  };

  const notifyTaskAssigned = (taskName: string, assignedTo: string) => {
    addNotification({
      title: "Nouvelle tâche assignée",
      message: `${taskName} assignée à ${assignedTo}`,
      type: "info",
      category: "project",
      priority: "medium",
      actionUrl: "/tasks"
    });
  };

  const notifyPaymentReceived = (amount: string, orderNumber: string) => {
    addNotification({
      title: "Paiement reçu",
      message: `${amount} reçu pour la commande ${orderNumber}`,
      type: "success",
      category: "order",
      priority: "low"
    });
  };

  const notifyStockLow = (productName: string, currentStock: number) => {
    addNotification({
      title: "Stock faible",
      message: `${productName} - Il ne reste que ${currentStock} unités`,
      type: "warning",
      category: "system",
      priority: "medium",
      actionUrl: "/supplier/products"
    });
  };

  return {
    notifyOrderReceived,
    notifySecurityAlert,
    notifyDeliveryUpdate,
    notifyProjectUpdate,
    notifySystemMaintenance,
    notifyTaskAssigned,
    notifyPaymentReceived,
    notifyStockLow
  };
};