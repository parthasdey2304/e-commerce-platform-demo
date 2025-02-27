import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from './AdminLayout';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  ArrowUpRight 
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch total sales
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('total_amount');
          
        if (salesError) throw salesError;
        
        // Fetch total orders
        const { count: orderCount, error: orderCountError } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });
          
        if (orderCountError) throw orderCountError;
        
        // Fetch total products
        const { count: productCount, error: productCountError } = await supabase
          .from('products')
          .select('*', { count: 'exact' });
          
        if (productCountError) throw productCountError;
        
        // Fetch total customers
        const { count: customerCount, error: customerCountError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
          
        if (customerCountError) throw customerCountError;
        
        // Fetch recent orders
        const { data: recentOrdersData, error: recentOrdersError } = await supabase
          .from('orders')
          .select('*, profiles:user_id(email)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentOrdersError) throw recentOrdersError;
        
        // Calculate total sales
        const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        setStats({
          totalSales,
          totalOrders: orderCount,
          totalProducts: productCount,
          totalCustomers: customerCount
        });
        
        setRecentOrders(recentOrdersData || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <StatCard 
          title="Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
        />
        <StatCard 
          title="Products" 
          value={stats.totalProducts} 
          icon={<Package className="h-6 w-6" />}
          color="orange"
        />
        <StatCard 
          title="Customers" 
          value={stats.totalCustomers} 
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/admin/orders" className="text-sm text-primary flex items-center">
              View All <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs border-b">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-2">{`#${order.id.slice(0, 8)}`}</td>
                      <td className="py-2">{order.profiles?.email || 'Unknown'}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 text-right font-medium">${order.total_amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                  
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Sales chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
