# ShopNow E-commerce Platform

ShopNow is a full-featured e-commerce web application built with modern technologies. It provides a comprehensive shopping experience for customers and powerful management tools for administrators.

![ShopNow Screenshot](https://via.placeholder.com/800x400?text=ShopNow+E-commerce)

## 🚀 Features

### Customer Features
- **User Authentication** - Secure login and registration
- **Product Browsing** - Browse products with filtering and search
- **Shopping Cart** - Add products to cart, update quantities, remove items
- **Checkout Process** - Secure and streamlined checkout experience
- **Order Management** - View order history and order details
- **Responsive Design** - Works across desktop, tablet, and mobile devices

### Admin Features
- **Dashboard** - Overview of sales, orders, products, and customers
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order statuses
- **Customer Management** - View and manage customer accounts

## 💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- A Supabase account

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/shopnow-ecommerce.git
cd shopnow-ecommerce
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Create a `.env` file in the project root directory
   - Add your Supabase URL and anonymous key
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
shopnow-ecommerce/
├── database/               # Database scripts and schema
├── public/                 # Public assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── products/       # Product-related components
│   │   └── ui/             # UI components (Shadcn)
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   └── admin/          # Admin pages
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## 🛠️ Supabase Database Schema

The application uses several tables in Supabase to manage data. The complete schema can be found in `/database/schema.sql`. Below is an overview of the main tables:

1. **profiles** - User profile information extending Supabase auth
2. **products** - Product details including name, price, and inventory
3. **categories** - Product categorization
4. **orders** - Order details including shipping and status
5. **order_items** - Individual items within orders
6. **cart_items** - Shopping cart contents for users
7. **product_reviews** - Customer ratings and comments for products

For a detailed view of the database schema including relationships, constraints, and indexes, please refer to the schema file.

## 🚀 Deployment

To deploy the application:

1. Build the project
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to any static web hosting:
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting
   - Supabase Hosting

## 🧪 Testing

Run tests with:
```bash
npm run test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)
