import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const AdvancedFilters = ({ onFiltersChange }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [minRating, setMinRating] = useState([0]);

  const suppliers = [
    'CIMAF', 'SIDERCEM', 'SAFETY FIRST', 'BOSCH', 'CERAMICA', 'WAVIN'
  ];

  const features = [
    'Prise rapide', 'Haute résistance', 'Résistant à la corrosion',
    'Haute adhérence', 'Faible retrait', 'Facile à façonner'
  ];

  const handleSupplierToggle = (supplier: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplier) 
        ? prev.filter(s => s !== supplier)
        : [...prev, supplier]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const applyFilters = () => {
    const filters = {
      priceRange,
      suppliers: selectedSuppliers,
      features: selectedFeatures,
      inStockOnly,
      hasDiscount,
      minRating: minRating[0]
    };
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedSuppliers([]);
    setSelectedFeatures([]);
    setInStockOnly(false);
    setHasDiscount(false);
    setMinRating([0]);
    onFiltersChange({});
  };

  const activeFiltersCount = 
    (selectedSuppliers.length > 0 ? 1 : 0) +
    (selectedFeatures.length > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (hasDiscount ? 1 : 0) +
    (minRating[0] > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-secondary text-secondary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres avancés</SheetTitle>
          <SheetDescription>
            Affinez votre recherche avec des critères spécifiques
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Prix */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prix (FCFA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()}</span>
                <span>{priceRange[1].toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fournisseurs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fournisseurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suppliers.map((supplier) => (
                <div key={supplier} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSuppliers.includes(supplier)}
                    onCheckedChange={() => handleSupplierToggle(supplier)}
                  />
                  <label className="text-sm">{supplier}</label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Note minimale */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Note minimale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={minRating}
                onValueChange={setMinRating}
                max={5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 ⭐</span>
                <span>{minRating[0]} ⭐ et plus</span>
              </div>
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <label className="text-sm">{feature}</label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) => setInStockOnly(checked === true)}
                />
                <label className="text-sm">Uniquement en stock</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={hasDiscount}
                  onCheckedChange={(checked) => setHasDiscount(checked === true)}
                />
                <label className="text-sm">Articles en promotion</label>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={applyFilters} className="w-full">
              Appliquer les filtres
            </Button>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Effacer tous les filtres
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;