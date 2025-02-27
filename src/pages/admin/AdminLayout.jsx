import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';

export function AdminLayout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: <Package className="h-5 w-5" />, 
      label: 'Products', 
      path: '/admin/products' 
    },
    { 
      icon: <ShoppingCart className="h-5 w-5" />, 
      label: 'Orders', 
      path: '/admin/orders' 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: 'Customers', 
      path: '/admin/customers' 
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: 'Settings', 
      path: '/admin/settings' 
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky top-0">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl text-primary">Admin Panel</h2>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive(item.path) 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                  {isActive(item.path) && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
