import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid gap-8 py-16 lg:grid-cols-4">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-secondary">
                <span className="text-lg font-bold text-white">SC</span>
              </div>
              <span className="text-xl font-bold">SmartChantier</span>
            </div>
            <p className="text-primary-foreground/80 max-w-xs">
              Réinventons les chantiers avec le digital. La plateforme intelligente pour les professionnels du BTP en Afrique.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link to="/marketplace" className="hover:text-secondary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-secondary transition-colors">
                  Gestion de chantiers
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-secondary transition-colors">
                  Sécurité intelligente
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link to="/help" className="hover:text-secondary transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-secondary transition-colors">
                  Tutoriels
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@smartchantier.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+225 01 02 03 04 05</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-primary-foreground/60">
              © 2024 SmartChantier. Tous droits réservés.
            </p>
            <div className="flex gap-4 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-secondary transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="/legal" className="hover:text-secondary transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;