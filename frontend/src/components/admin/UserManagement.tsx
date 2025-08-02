import { useState } from "react";
import { 
  Users, Search, Plus, Edit, Trash2, MoreHorizontal, 
  Shield, Mail, Phone, MapPin, Calendar, Filter,
  UserCheck, UserX, Crown, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: "admin" | "contractor" | "supplier";
  status: "active" | "inactive" | "suspended" | "pending";
  joinedAt: string;
  lastLogin: string;
  location: string;
  totalProjects?: number;
  totalRevenue?: string;
  verificationStatus: "verified" | "pending" | "rejected";
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [users] = useState<User[]>([
    {
      id: "1",
      firstName: "Jean",
      lastName: "Kouadio",
      email: "jean.kouadio@builtech.ci",
      phone: "+225 07 12 34 56 78",
      company: "BuildTech Construction",
      role: "contractor",
      status: "active",
      joinedAt: "2024-01-15",
      lastLogin: "2024-01-20 14:30",
      location: "Abidjan, Côte d'Ivoire",
      totalProjects: 12,
      totalRevenue: "2.4M CFA",
      verificationStatus: "verified"
    },
    {
      id: "2", 
      firstName: "Marie",
      lastName: "Diabaté",
      email: "marie.diabate@cementsupply.ci",
      phone: "+225 05 98 76 54 32",
      company: "Cement Supply Pro",
      role: "supplier",
      status: "active",
      joinedAt: "2024-01-10",
      lastLogin: "2024-01-20 09:15",
      location: "Yamoussoukro, Côte d'Ivoire",
      totalRevenue: "1.8M CFA",
      verificationStatus: "verified"
    },
    {
      id: "3",
      firstName: "Paul",
      lastName: "Bamba",
      email: "paul.bamba@ironworks.ci",
      phone: "+225 01 23 45 67 89",
      company: "Ironworks Solutions",
      role: "supplier",
      status: "pending",
      joinedAt: "2024-01-18",
      lastLogin: "2024-01-19 16:45",
      location: "San Pedro, Côte d'Ivoire",
      verificationStatus: "pending"
    },
    {
      id: "4",
      firstName: "Fatou",
      lastName: "Traoré",
      email: "fatou.traore@modernconstruct.ci",
      phone: "+225 07 11 22 33 44",
      company: "Modern Construct",
      role: "contractor",
      status: "suspended",
      joinedAt: "2024-01-05",
      lastLogin: "2024-01-17 11:20",
      location: "Bouaké, Côte d'Ivoire",
      totalProjects: 3,
      verificationStatus: "rejected"
    }
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "contractor": return "bg-blue-100 text-blue-800";
      case "supplier": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified": return <UserCheck className="h-4 w-4" />;
      case "pending": return <AlertTriangle className="h-4 w-4" />;
      case "rejected": return <UserX className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    contractors: users.filter(u => u.role === "contractor").length,
    suppliers: users.filter(u => u.role === "supplier").length,
    pending: users.filter(u => u.verificationStatus === "pending").length
  };

  return (
    <div className="space-y-6">

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="contractor">Entrepreneurs</SelectItem>
                  <SelectItem value="supplier">Fournisseurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input placeholder="Prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Nom de famille" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@exemple.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input placeholder="+225 XX XX XX XX XX" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entreprise</Label>
                      <Input placeholder="Nom de l'entreprise" />
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contractor">Entrepreneur</SelectItem>
                          <SelectItem value="supplier">Fournisseur</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Localisation</Label>
                    <Input placeholder="Ville, Pays" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Notes additionnelles..." />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => setIsAddUserOpen(false)}>
                      Créer utilisateur
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Vérification</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Performances</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.company}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === "contractor" ? "Entrepreneur" :
                       user.role === "supplier" ? "Fournisseur" : "Admin"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === "active" ? "Actif" :
                       user.status === "inactive" ? "Inactif" :
                       user.status === "suspended" ? "Suspendu" : "En attente"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getVerificationColor(user.verificationStatus)}>
                      {getVerificationIcon(user.verificationStatus)}
                      <span className="ml-1">
                        {user.verificationStatus === "verified" ? "Vérifié" :
                         user.verificationStatus === "pending" ? "En attente" : "Rejeté"}
                      </span>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {user.role === "contractor" && (
                      <div className="text-sm">
                        <div>{user.totalProjects} projets</div>
                        <div className="text-muted-foreground">{user.totalRevenue}</div>
                      </div>
                    )}
                    {user.role === "supplier" && (
                      <div className="text-sm">
                        <div className="text-muted-foreground">{user.totalRevenue}</div>
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}