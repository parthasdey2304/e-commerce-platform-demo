import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">ShopNow</Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/products" className="hover:text-primary">Products</Link>
          {user && <Link to="/orders" className="hover:text-primary">My Orders</Link>}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="hover:text-primary">Admin</Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
