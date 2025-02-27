import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to homepage
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to ShopNow</h1>
        
        <Tabs defaultValue="login" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
        
        {/* Social Login Buttons */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Google
            </button>
            <button className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
