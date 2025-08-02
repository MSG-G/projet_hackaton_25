import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
// All pages import
import {
  // Shared
  Landing,
  Marketplace,
  Security,
  Auth,
  NotFound,
  // Contractor
  ContractorDashboard,
  ContractorProjects,
  ProjectDetail,
  NewProject,
  Tasks,
  NewTask,
  Cart,
  Delivery,
  // Supplier
  SupplierDashboard,
  SupplierProducts,
  SupplierOrders,
  SupplierAnalytics,
  // Admin
  AdminDashboard,
  AdminProjects,
  AdminMonitoring
} from "./pages";
import Subscription from "./pages/shared/Subscription";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<Auth />} />
          
          {/* Redirection automatique selon le rôle */}
          <Route path="/dashboard-redirect" element={<RoleBasedRedirect />} />
          
          {/* Pages accessibles à tous les utilisateurs connectés */}
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/delivery" element={
            <ProtectedRoute>
              <Delivery />
            </ProtectedRoute>
          } />
          
          {/* Pages pour ENTREPRENEURS uniquement */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="contractor">
              <ContractorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <ContractorProjects />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute requiredRole="contractor">
              <ProjectDetail />
            </ProtectedRoute>
          } />
          <Route path="/projects/new" element={
            <ProtectedRoute requiredRole="contractor">
              <NewProject />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute requiredRole="contractor">
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/tasks/new" element={
            <ProtectedRoute requiredRole="contractor">
              <NewTask />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute requiredRole="contractor">
              <Cart />
            </ProtectedRoute>
          } />
          
          {/* Pages pour FOURNISSEURS uniquement */}
          <Route path="/supplier" element={
            <ProtectedRoute requiredRole="supplier">
              <SupplierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/supplier/products" element={
            <ProtectedRoute requiredRole="supplier">
              <SupplierProducts />
            </ProtectedRoute>
          } />
          <Route path="/supplier/orders" element={
            <ProtectedRoute requiredRole="supplier">
              <SupplierOrders />
            </ProtectedRoute>
          } />
          <Route path="/supplier/analytics" element={
            <ProtectedRoute requiredRole="supplier">
              <SupplierAnalytics />
            </ProtectedRoute>
          } />
          
          {/* Pages pour ADMIN uniquement */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute requiredRole="admin">
              <AdminProjects />
            </ProtectedRoute>
          } />
          <Route path="/admin/monitoring" element={
            <ProtectedRoute requiredRole="admin">
              <AdminMonitoring />
            </ProtectedRoute>
          } />
          <Route path="/admin/subscriptions" element={
            <ProtectedRoute requiredRole="admin">
              <SubscriptionManagement />
            </ProtectedRoute>
          } />
          <Route path="/security" element={
            <ProtectedRoute requiredRole="admin">
              <Security />
            </ProtectedRoute>
          } />
          
          {/* Page d'erreur 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
