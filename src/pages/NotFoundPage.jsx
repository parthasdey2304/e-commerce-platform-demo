import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-6xl font-bold text-primary mb-4">404</div>
      <h1 className="text-2xl font-bold mb-6">Page Not Found</h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button>
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
}
