import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { supplierApi, ProductInput } from "@/api/supplier";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Actif" | "En rupture" | "En révision";
  images: string[];
  description: string;
}

export default function SupplierProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Récupérer les produits au chargement
  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    setLoading(true);
    supplierApi
      .getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // ---------------------------
  // Formulaire produit
  const [form, setForm] = useState<ProductInput & { imageFile?: File }>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    images: [],
    categoryId: undefined,
  });

  // Catégories récupérées depuis l'API
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supplierApi.getCategories()
      .then((data) => {
        console.log('categories fetched', data);
        setCategories(data);
      })
      .catch((err) => console.error('categories error', err));
  }, []);

  const updateForm = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Gestion upload images
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEdit = (p: Product) => {
    setSelectedProduct(p);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      categoryId: (categories.find(c=>c.name===p.category)?.id) ?? undefined,
      images: p.images ?? [],
      imageFile: undefined
    });
    setIsAddProductOpen(true);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateForm("imageFile", e.target.files[0]);
    }
  };

  // Handler add/edit product
  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await supplierApi.deleteProduct(id);
      reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', String(form.price));
    fd.append('stock', String(form.stock));
    if (form.description) fd.append('description', form.description);
    if (form.categoryId) fd.append('categoryId', form.categoryId);
    if (form.imageFile) fd.append('images', form.imageFile);
    try {
      if (selectedProduct) {
        await supplierApi.updateProduct(selectedProduct.id, fd);
      } else {
        await supplierApi.createProduct(fd);
      }
      // reset form
      setForm({ name: "", price: 0, stock: 0, description: "", categoryId: undefined, images: [] });
      setSelectedProduct(null);
      reload();
      setIsAddProductOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "En rupture":
        return "bg-red-100 text-red-800";
      case "En révision":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Actif":
        return <CheckCircle className="h-4 w-4" />;
      case "En rupture":
        return <AlertCircle className="h-4 w-4" />;
      case "En révision":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-light">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Produits</h1>
                <p className="text-muted-foreground">
                  Gérez votre catalogue de produits BTP
                </p>
              </div>
            </div>

            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setSelectedProduct(null);
                    setForm({ name: "", price: 0, stock: 0, description: "", categoryId: undefined, images: [] });
                    setIsAddProductOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nom du produit</Label>
                      <Input
                        id="productName"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Ex: Ciment Portland..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={form.categoryId}
                        onValueChange={(val) => updateForm("categoryId", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Upload d'images */}
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer text-muted-foreground hover:bg-muted"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>Sélectionner des images</span>
                      {form.imageFile ? (
                        <span className="text-sm mt-1">1 image sélectionnée</span>
                      ) : null}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFiles}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix unitaire</Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => updateForm("price", Number(e.target.value))}
                        placeholder="Ex: 2500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock disponible</Label>
                      <Input
                        id="stock"
                        type="number"
                        min={0}
                        value={form.stock}
                        onChange={(e) => updateForm("stock", Number(e.target.value))}
                        placeholder="Ex: 150"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description ?? ""}
                      onChange={(e) => updateForm("description", e.target.value)}
                      placeholder="Description détaillée du produit..."
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="bg-secondary hover:bg-secondary-dark"
                      disabled={!form.name || form.price <= 0}
                      onClick={handleSave}
                    >
                      {selectedProduct ? 'Mettre à jour' : 'Ajouter le produit'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total produits</p>
                    <p className="text-2xl font-bold text-foreground">
                      {products.length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Produits actifs</p>
                    <p className="text-2xl font-bold text-success">
                      {products.filter((p) => p.stock > 0).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En rupture</p>
                    <p className="text-2xl font-bold text-destructive">
                      {products.filter((p) => p.stock === 0).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valeur stock</p>
                    <p className="text-2xl font-bold text-foreground">{stockValue.toLocaleString('fr-FR')} CFA</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche et filtres */}
          <Card className="shadow-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="rupture">En rupture</SelectItem>
                    <SelectItem value="revision">En révision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="shadow-card hover:shadow-construction transition-all duration-300"
              >
                <CardContent className="p-0">
                  {/* Image du produit */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${product.images[0].startsWith('http') ? '' : 'http://localhost:5000'}${product.images[0]}`}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>

                  {/* Détails */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-xs text-muted-foreground mb-3">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-secondary">{product.price} CFA</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(product)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="shadow-card mt-6">
              <CardContent className="p-4 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Aucun produit trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
