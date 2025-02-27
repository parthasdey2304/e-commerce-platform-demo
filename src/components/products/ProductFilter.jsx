import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

export function ProductFilter({ categories, onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    onSaleOnly: false,
  });

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (values) => {
    handleFilterChange('priceRange', values);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      category: 'all',
      priceRange: [0, 1000],
      onSaleOnly: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="text-sm font-medium">Search</label>
            <Input 
              id="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Price Range</label>
            <div className="mt-2">
              <Slider
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={10}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="onSaleOnly"
              checked={filters.onSaleOnly}
              onChange={(e) => handleFilterChange('onSaleOnly', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="onSaleOnly" className="text-sm font-medium">On Sale Only</label>
          </div>
          
          <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
