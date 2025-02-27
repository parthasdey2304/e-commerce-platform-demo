import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  
  const handleQuantityChange = async (product, change) => {
    if (product.quantity + change < 1) return;
    
    setIsUpdating(true);
    try {
      if (change > 0) {
        await addToCart(product, 1);
      } else {
        const updatedProduct = { ...product };
        updatedProduct.quantity = 1; // Set to 1 for removing single item
        await removeFromCart(product.id);
        if (product.quantity - 1 > 0) {
          updatedProduct.quantity = product.quantity - 1;
          await addToCart(updatedProduct, product.quantity - 1);
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemoveItem = async (productId) => {
    setIsUpdating(true);
    try {
      await removeFromCart(productId);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // Assuming 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b">
              <div className="col-span-6 font-medium">Product</div>
              <div className="col-span-2 font-medium text-center">Price</div>
              <div className="col-span-2 font-medium text-center">Quantity</div>
              <div className="col-span-2 font-medium text-right">Total</div>
            </div>
            
            {/* Cart Items */}
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                    {/* Product Info */}
                    <div className="md:col-span-6 flex items-center mb-4 md:mb-0">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <Link to={`/products/${item.id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="md:col-span-2 text-center">
                      <div className="md:hidden font-medium inline-block mr-2">Price:</div>
                      ${item.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity */}
                    <div className="md:col-span-2 flex justify-center items-center my-4 md:my-0">
                      <div className="md:hidden font-medium inline-block mr-2">Quantity:</div>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={isUpdating}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="md:col-span-2 text-right flex justify-between md:block">
                      <div>
                        <div className="md:hidden font-medium inline-block mr-2">Total:</div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Actions */}
            <div className="p-4 bg-gray-50 flex flex-wrap justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => clearCart()}
                disabled={isUpdating}
              >
                Clear Cart
              </Button>
              <Link to="/products">
                <Button variant="link">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
