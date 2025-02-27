import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilter } from '../components/products/ProductFilter';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '1000')
    ],
    onSaleOnly: searchParams.get('sale') === 'true'
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*');
        
        // Apply filters
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
        
        if (filters.category !== 'all') {
          query = query.eq('category_id', filters.category);
        }
        
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
          query = query
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1]);
        }
        
        if (filters.onSaleOnly) {
          query = query.eq('on_sale', true);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    
    // Update URL search params
    const newSearchParams = new URLSearchParams();
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.category !== 'all') newSearchParams.set('category', filters.category);
    if (filters.priceRange[0] > 0) newSearchParams.set('minPrice', filters.priceRange[0]);
    if (filters.priceRange[1] < 1000) newSearchParams.set('maxPrice', filters.priceRange[1]);
    if (filters.onSaleOnly) newSearchParams.set('sale', 'true');
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <ProductFilter 
            categories={categories} 
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p>Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
