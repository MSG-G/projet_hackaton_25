// Export all pages with prefixed names to avoid conflicts
export { 
  Dashboard as ContractorDashboard,
  Projects as ContractorProjects,
  ProjectDetail,
  NewProject,
  Tasks,
  NewTask,
  Cart,
  Delivery
} from './contractor';

export { 
  Dashboard as SupplierDashboard,
  Products as SupplierProducts,
  Orders as SupplierOrders,
  Analytics as SupplierAnalytics
} from './supplier';

export { 
  Dashboard as AdminDashboard,
  Projects as AdminProjects,
  Monitoring as AdminMonitoring
} from './admin';

export { 
  Landing,
  Auth,
  Marketplace,
  Security,
  NotFound
} from './shared';