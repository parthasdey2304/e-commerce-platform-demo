import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/button';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(8);

        if (productsError) throw productsError;
        
        // Fetch categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .limit(4);
          
        if (categoryError) throw categoryError;
        
        setFeaturedProducts(products || []);
        setCategories(categoryData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 rounded-xl mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopNow</h1>
            <p className="text-lg mb-8">Discover amazing products at incredible prices.</p>
            <Link to="/products">
              <Button size="lg" variant="secondary">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p>No featured products available.</p>
        )}
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="relative overflow-hidden rounded-lg h-40 group"
            >
              <img 
                src={category.image_url || 'https://via.placeholder.com/300x150'} 
                alt={category.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="bg-gray-100 rounded-xl p-8 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Summer Sale</h2>
            <p className="text-gray-700 mb-4">Get up to 50% off on selected items. Limited time offer!</p>
            <Link to="/products?sale=true">
              <Button>Shop the Sale</Button>
            </Link>
          </div>
          <div className="md:w-1/3">
            <img 
              src="https://via.placeholder.com/400x300" 
              alt="Summer Sale"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
