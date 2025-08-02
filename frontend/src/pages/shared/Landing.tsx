import { ArrowRight, ShoppingCart, Zap, Shield, BarChart3, Users, CheckCircle, Star, PlayCircle, Smartphone, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-construction.jpg";

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: "E-commerce Intelligent",
    description: "Commandez vos matériaux en quelques clics avec livraison directe sur chantier",
    stats: "10k+ produits"
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-secondary" />,
    title: "Gestion Projet",
    description: "Suivez l'avancement de vos chantiers en temps réel avec tableaux de bord intelligents",
    stats: "+40% productivité"
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Sécurité IA",
    description: "Surveillance automatique des risques avec alertes préventives pour protéger vos équipes",
    stats: "-65% incidents"
  }
];

const stats = [
  { number: "500+", label: "Chantiers actifs" },
  { number: "95%", label: "Satisfaction client" },
  { number: "2min", label: "Temps de réponse" },
  { number: "24/7", label: "Support disponible" }
];

const benefits = [
  "Interface intuitive et moderne",
  "Notifications en temps réel",
  "Intégration complète",
  "Support client expert",
  "Sécurité renforcée",
  "Analytics avancés"
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Ouvriers sur chantier de construction" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/80"></div>
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 animate-fade-in">
              <Zap className="h-4 w-4 mr-2" />
              Plateforme nouvelle génération
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl mb-6 animate-fade-in text-white" style={{ animationDelay: '0.1s' }}>
              Révolutionnez vos{" "}
              <span className="bg-gradient-to-r from-secondary to-orange-400 bg-clip-text text-transparent">
                chantiers
              </span>
              {" "}avec l'intelligence
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              BluidTechAfrica connecte entrepreneurs, fournisseurs et équipes pour optimiser 
              chaque aspect de vos projets de construction avec la technologie moderne.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" variant="secondary" className="hover-scale group">
                <Link to="/auth">
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale group border-white text-white hover:bg-white hover:text-primary">
                <Link to="/subscription">
                  <Star className="mr-2 h-4 w-4" />
                  Voir nos packs
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover-scale">
                  <div className="text-3xl font-bold text-secondary mb-1 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary">
              ⚡ Fonctionnalités principales
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              Tout ce dont vous avez besoin en une plateforme
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Des outils intelligents conçus pour simplifier et optimiser votre travail quotidien
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-background/80 backdrop-blur">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="transition-transform group-hover:scale-110 duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="bg-background rounded-2xl p-8 shadow-sm border">
            <h3 className="text-xl font-semibold mb-6 text-center">Pourquoi choisir BluidTechAfrica ?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Adopté par 500+ entreprises</h3>
            <p className="text-muted-foreground">
              "BluidTechAfrica a transformé notre façon de travailler. Gain de temps et d'efficacité incroyable !"
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">AB</div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-semibold">CD</div>
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">EF</div>
              </div>
              <span className="text-sm text-muted-foreground">Amadou B., Fatou K., Ibrahim S.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container text-center relative">
          <div className="mx-auto max-w-2xl text-white">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
              Prêt à révolutionner vos chantiers ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Rejoignez des centaines d'entreprises qui font déjà confiance à BluidTechAfrica 
              pour optimiser leurs projets de construction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="hover-scale group">
                <Link to="/auth">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary hover-scale">
                <Link to="/marketplace">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Explorer la plateforme
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Gratuit pendant 30 jours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Sécurisé & confidentiel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;