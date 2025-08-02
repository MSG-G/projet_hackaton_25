import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const orderSchema = z.object({
  supplier: z.string().min(1, "Le fournisseur est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  deliveryDate: z.date({
    required_error: "La date de livraison est requise",
  }),
  deliveryAddress: z.string().min(1, "L'adresse de livraison est requise"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

const suppliers = [
  "CIMAF",
  "SIDERCEM", 
  "BATIMAT",
  "SOGEMAT",
  "TRACTAFRIC",
  "CFAO MOTORS",
  "Autre"
];

const categories = [
  "Matériaux de construction",
  "Outillage",
  "Équipements",
  "Transport",
  "Services",
  "Électricité",
  "Plomberie",
  "Peinture"
];

const units = ["sac", "tonne", "m²", "m³", "pièce", "litre", "kg", "m"];

interface NewOrderFormProps {
  children: React.ReactNode;
  onOrderCreated?: (order: any) => void;
}

const NewOrderForm = ({ children, onOrderCreated }: NewOrderFormProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    quantity: 1,
    unit: "pièce",
    unitPrice: 0
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      supplier: "",
      category: "",
      deliveryAddress: "",
      priority: "medium",
      notes: "",
    },
  });

  const addItem = () => {
    if (currentItem.name && currentItem.quantity > 0 && currentItem.unitPrice > 0) {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        ...currentItem
      };
      setItems([...items, newItem]);
      setCurrentItem({
        name: "",
        quantity: 1,
        unit: "pièce",
        unitPrice: 0
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const onSubmit = (data: OrderFormData) => {
    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article à la commande");
      return;
    }

    const newOrder = {
      id: `CMD-${Date.now()}`,
      ...data,
      items: items,
      totalAmount: getTotalAmount(),
      status: "En attente",
      createdAt: new Date(),
    };

    console.log("Nouvelle commande:", newOrder);
    
    // Simuler l'envoi de la commande
    toast.success("Commande créée avec succès!");
    
    onOrderCreated?.(newOrder);
    
    // Reset form
    form.reset();
    setItems([]);
    setOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent": return "Urgente";
      case "high": return "Haute";
      case "medium": return "Moyenne";
      case "low": return "Basse";
      default: return priority;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
          <DialogDescription>
            Créer une nouvelle commande pour ce chantier
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fournisseur */}
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catégorie */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date de livraison */}
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de livraison</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priorité */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Adresse de livraison */}
            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de livraison</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète de livraison" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Articles de la commande */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Articles de la commande</h3>
              
              {/* Ajout d'article */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 bg-muted/50 rounded-lg">
                <Input
                  placeholder="Nom de l'article"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Quantité"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                />
                <Select 
                  value={currentItem.unit} 
                  onValueChange={(value) => setCurrentItem({...currentItem, unit: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Prix unitaire"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})}
                />
                <Button type="button" onClick={addItem} variant="construction">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Liste des articles */}
              {items.length > 0 && (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {item.quantity} {item.unit} × {item.unitPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-lg font-bold">
                    Total: {getTotalAmount().toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Instructions spéciales, commentaires..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Résumé de la commande */}
            {items.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="font-semibold">Résumé de la commande</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Fournisseur:</span> {form.watch("supplier")}</p>
                    <p><span className="font-medium">Catégorie:</span> {form.watch("category")}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Articles:</span> {items.length}</p>
                    <p><span className="font-medium">Priorité:</span> 
                      <Badge className={`ml-2 ${getPriorityColor(form.watch("priority"))}`}>
                        {getPriorityLabel(form.watch("priority"))}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="construction">
                Créer la commande
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderForm;