import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/products/ProductCard';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories:category_id(*)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);

        // Fetch related products from same category
        if (data && data.category_id) {
          const { data: related, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', id)
            .limit(4);
            
          if (relatedError) throw relatedError;
          setRelatedProducts(related || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, quantity + value);
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 p-8 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="mb-4">{error || 'This product does not exist or has been removed.'}</p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/products" className="text-primary hover:underline">
          ← Back to Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain object-center"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="mt-4">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.on_sale && product.original_price && (
              <span className="ml-2 text-gray-500 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Quantity Selector */}
          <div className="mt-8">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              className="w-full md:w-auto"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 border-t pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p className="text-gray-600">{product.categories?.name || 'Uncategorized'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Availability</h3>
                <p className="text-gray-600">
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
