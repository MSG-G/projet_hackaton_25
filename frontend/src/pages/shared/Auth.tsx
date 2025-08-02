import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: ''
  });
  
  const { login, register, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur SmartChantier !",
        });
        let target = '/dashboard';
        if (user?.role === 'admin') target = '/admin';
        else if (user?.role === 'supplier') target = '/supplier';
        else if (user?.role === 'contractor') target = '/dashboard';
        navigate(target, { replace: true });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect. Utilisez 'demo123' comme mot de passe.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        phone: formData.phone,
        role: userType as 'contractor' | 'supplier' | 'admin'
      });
      
      if (success) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
        });
        let target = '/dashboard';
        if (userType === 'admin') target = '/admin';
        else if (userType === 'supplier') target = '/supplier';
        navigate(target, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <span className="text-2xl font-bold text-primary">SC</span>
            </div>
            <span className="text-2xl font-bold text-white">SmartChantier</span>
          </Link>
          <p className="text-white/80 mt-2">Connectez-vous à votre espace professionnel</p>
        </div>

        <Card className="shadow-glow border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="chef@btp-plateau.ci"
                      className="h-12"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Se souvenir de moi</Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12" 
                    variant="construction"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        Se connecter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <button className="text-primary hover:underline font-medium">
                    Créer un compte
                  </button>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label>Type de compte</Label>
                    <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-input hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="contractor" id="contractor" />
                        <Label htmlFor="contractor" className="cursor-pointer flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-sm">Chef de chantier</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-input hover:bg-accent cursor-pointer" onClick={() => setUserType('supplier')}>
                        <RadioGroupItem value="supplier" id="supplier" />
                        <Label htmlFor="supplier" className="cursor-pointer flex items-center space-x-2">
                          <Users className="h-4 w-4 text-secondary" />
                          <span className="text-sm">Fournisseur</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-input hover:bg-accent cursor-pointer" onClick={() => setUserType('admin')}>
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="cursor-pointer flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-destructive" />
                          <span className="text-sm">Admin</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        placeholder="Jean" 
                        className="h-12"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        placeholder="Kouassi" 
                        className="h-12"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">
                      {userType === "contractor" ? "Entreprise / Chantier" : "Nom de l'entreprise"}
                    </Label>
                    <Input 
                      id="company" 
                      name="company"
                      placeholder={userType === "contractor" ? "BTP Plateau SARL" : "Matériaux Modernes SARL"} 
                      className="h-12"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email professionnel</Label>
                    <Input 
                      id="registerEmail" 
                      name="email"
                      type="email" 
                      placeholder="jean.kouassi@entreprise.com"
                      className="h-12"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel" 
                      placeholder="+225 01 02 03 04 05"
                      className="h-12"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <div className="relative">
                      <Input 
                        id="registerPassword" 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 caractères"
                        className="h-12 pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12" 
                    variant="construction"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      <>
                        Créer mon compte
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <button className="text-primary hover:underline font-medium">
                    Se connecter
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center text-white/80">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-2xl">🛒</div>
              <p>E-commerce BTP</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🏗️</div>
              <p>Gestion chantiers</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🛡️</div>
              <p>Sécurité intelligente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;