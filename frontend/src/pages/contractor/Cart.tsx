import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { mockCart } from '@/data/mockData';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCart);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // TVA 18%
  const shipping = subtotal > 500000 ? 0 : 25000; // Livraison gratuite > 500k
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    // Simulation de commande
    console.log('Commande passée:', { items: cartItems, total });
    navigate('/delivery');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Mon Panier</h1>
            <p className="text-xl text-white/90">
              Finalisez votre commande de matériaux de construction
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des produits depuis le marketplace pour continuer
            </p>
            <Button 
              onClick={() => navigate('/marketplace')} 
              variant="construction"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">Articles dans votre panier</h2>
              
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {item.image}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Par {item.supplier}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            {item.price.toLocaleString()} FCFA
                          </span>
                          <span className="text-sm text-muted-foreground">
                            par {item.unit}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Total & Remove */}
                      <div className="text-right space-y-2">
                        <div className="font-bold text-lg">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>TVA (18%)</span>
                    <span>{tax.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Livraison</span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <div>
                          <span className="text-success font-medium">Gratuite</span>
                          <div className="text-xs text-muted-foreground">
                            Commande &gt; 500k FCFA
                          </div>
                        </div>
                      ) : (
                        <span>{shipping.toLocaleString()} FCFA</span>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    variant="construction"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Passer la commande
                  </Button>
                </CardContent>
              </Card>
              
              {/* Delivery Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Informations de livraison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Express</Badge>
                    <span className="text-sm">24-48h</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Standard</Badge>
                    <span className="text-sm">3-5 jours</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Les délais peuvent varier selon votre localisation et la disponibilité des produits.
                  </p>
                </CardContent>
              </Card>
              
              {/* Continue Shopping */}
              <Card>
                <CardContent className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/marketplace')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continuer mes achats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;