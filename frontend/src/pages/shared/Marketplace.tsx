import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  ShoppingCart,
  Heart,
  Star,
  BarChart3,
  Image as ImageIcon,
  Archive,
  Hammer,
  Shield,
  Zap,
  Droplet,
  LayoutGrid,
  Boxes,
} from "lucide-react";
import { marketplaceApi, MarketplaceProduct } from "@/api/marketplace";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdvancedFilters from "@/components/marketplace/AdvancedFilters";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Mapping catégorie -> icône de remplacement
const categoryIcons: Record<string, React.ComponentType<any>> = {
  "Ciment": Archive,
  "Fer à béton": Boxes,
  "Outillage": Hammer,
  "EPI": Shield,
  "Électricité": Zap,
  "Plomberie": Droplet,
  "Carrelage": LayoutGrid,
};

const categories = [
  "Tous",
  "Ciment",
  "Fer à béton",
  "Outillage",
  "EPI",
  "Électricité",
  "Plomberie",
  "Carrelage",
];

const Marketplace = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // fetch products when filters change (reset page)
  useEffect(() => {
    const params = {
      q: searchTerm || undefined,
      category: selectedCategory !== "Tous" ? selectedCategory : undefined,
      sort: sortBy,
      page: 1,
    } as Record<string, string | number | undefined>;
    setLoading(true);
    marketplaceApi
      .getProducts(params)
      .then((data) => {
        setProducts(data);
        setPage(1);
        setHasMore(data.length === 40);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, [searchTerm, selectedCategory, sortBy]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || product.category === selectedCategory;

    // Apply advanced filters
    let passesAdvancedFilters = true;

    if (advancedFilters.priceRange) {
      const price =
        typeof product.price === "string"
          ? parseInt(product.price.replace(/\s/g, ""), 10)
          : product.price;
      passesAdvancedFilters =
        passesAdvancedFilters &&
        price >= advancedFilters.priceRange[0] &&
        price <= advancedFilters.priceRange[1];
    }

    if (advancedFilters.suppliers?.length > 0) {
      passesAdvancedFilters =
        passesAdvancedFilters &&
        advancedFilters.suppliers.includes(product.supplier);
    }

    if (advancedFilters.inStockOnly) {
      passesAdvancedFilters = passesAdvancedFilters && product.inStock;
    }

    if (advancedFilters.hasDiscount) {
      passesAdvancedFilters = passesAdvancedFilters && !!product.discount;
    }

    if (advancedFilters.minRating) {
      passesAdvancedFilters =
        passesAdvancedFilters && product.rating >= advancedFilters.minRating;
    }

    return matchesSearch && matchesCategory && passesAdvancedFilters;
  });

  const ProductComparisonDialog = ({ product }: { product: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <BarChart3 className="h-4 w-4 mr-2" />
          Comparer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comparaison de produit</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Par {product.supplier}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prix:</span>
                <span className="font-medium">{product.price} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Note:</span>
                <span className="font-medium">{product.rating} ⭐</span>
              </div>
              <div className="flex justify-between">
                <span>Stock:</span>
                <span
                  className={product.inStock ? "text-success" : "text-destructive"}
                >
                  {product.inStock ? "Disponible" : "Rupture"}
                </span>
              </div>
              {product.discount && (
                <div className="flex justify-between">
                  <span>Remise:</span>
                  <span className="text-secondary font-medium">
                    -{product.discount}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Produits similaires</h4>
            <div className="space-y-2">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 3)
                .map((similarProduct) => (
                  <div
                    key={similarProduct.id}
                    className="p-2 border rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{similarProduct.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {similarProduct.supplier}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {similarProduct.price} FCFA
                      </p>
                      <p className="text-xs">{similarProduct.rating} ⭐</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Marketplace BTP</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez notre sélection de matériaux et équipements de qualité,
              livrés directement sur vos chantiers
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des matériaux, outils, équipements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                <SelectItem value="newest">Plus récents</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} produits trouvés
          </p>
          <AdvancedFilters onFiltersChange={setAdvancedFilters} />
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-construction transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative mb-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `${
                                import.meta.env.VITE_API_URL ||
                                "http://localhost:5000"
                              }${product.image}`
                        }
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-sm leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Par {product.supplier}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "fill-secondary text-secondary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {product.price} FCFA
                      </div>
                      <div className="text-xs text-muted-foreground">
                        par {product.unit}
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          unit: product.unit,
                          supplier: product.supplier,
                          image: product.image,
                        })
                      }
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
                    </Button>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          product.inStock ? "bg-success" : "bg-destructive"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          product.inStock ? "text-success" : "text-destructive"
                        }`}
                      >
                        {product.inStock ? "En stock" : "Rupture de stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <ProductComparisonDialog product={product} />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More / Loading */}
        <div className="text-center mt-12 space-y-4">
          {loading && <p>Chargement...</p>}
          {error && <p className="text-destructive">{error}</p>}
          {!loading && hasMore && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const nextPage = page + 1;
                setLoading(true);
                const params = {
                  q: searchTerm || undefined,
                  category:
                    selectedCategory !== "Tous" ? selectedCategory : undefined,
                  sort: sortBy,
                  page: nextPage,
                } as Record<string, string | number | undefined>;
                marketplaceApi
                  .getProducts(params)
                  .then((data) => {
                    setProducts((prev) => [...prev, ...data]);
                    setPage(nextPage);
                    setHasMore(data.length === 40);
                  })
                  .catch((err) => {
                    console.error(err);
                    setError("Erreur de chargement");
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Charger plus de produits
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
