import { useState } from "react";
import { Menu, X, User, LogOut, Settings, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/notifications/NotificationBell";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];
    
    if (user?.role === 'contractor') {
      return [
        { name: "Marketplace", href: "/marketplace", active: location.pathname === "/marketplace" },
        { name: "Mes chantiers", href: "/projects", active: location.pathname === "/projects" },
        { name: "Mes tâches", href: "/tasks", active: location.pathname === "/tasks" },
        { name: "Livraisons", href: "/delivery", active: location.pathname === "/delivery" },
        { name: "Tableau de bord", href: "/dashboard", active: location.pathname === "/dashboard" }
      ];
    } else if (user?.role === 'supplier') {
      return [
        { name: "Mon tableau de bord", href: "/supplier", active: location.pathname === "/supplier" || location.pathname === "/dashboard" },
        { name: "Mes produits", href: "/supplier/products", active: location.pathname === "/supplier/products" },
        { name: "Commandes", href: "/supplier/orders", active: location.pathname === "/supplier/orders" },
        { name: "Analytics", href: "/supplier/analytics", active: location.pathname === "/supplier/analytics" }
      ];
    } else if (user?.role === 'admin') {
      return [
        { name: "Administration", href: "/admin", active: location.pathname === "/admin" },
        { name: "Tous les projets", href: "/admin/projects", active: location.pathname === "/admin/projects" },
        { name: "Sécurité", href: "/security", active: location.pathname === "/security" },
        { name: "Monitoring", href: "/admin/monitoring", active: location.pathname === "/admin/monitoring" }
      ];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
              <img
                src="/bluidtech-logo.jpg"
                alt="BluidTechAfrica logo"
                className="h-8 w-8 rounded-lg"
              />
              <span className="inline-block font-bold text-xl text-primary">BluidTechAfrica</span>
            </Link>


          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    item.active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="hidden lg:flex flex-1 max-w-sm items-center space-x-2 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des matériaux..."
                  className="w-full pl-10 pr-4 bg-muted/50"
                />
              </div>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                {user?.role === 'contractor' && (
                  <Button variant="ghost" size="icon" className="relative" asChild>
                    <Link to="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
                        3
                      </Badge>
                    </Link>
                  </Button>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="text-2xl">{user?.avatar || '👤'}</div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{user?.company}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="construction">
                <Link to="/auth">Connexion</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    item.active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-md text-left text-muted-foreground hover:text-primary hover:bg-muted"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;