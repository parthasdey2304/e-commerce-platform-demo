import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ShoppingCart } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-medium text-primary">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4">
          <Button onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
