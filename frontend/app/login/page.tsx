'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // Pastikan sudah install lucide-react

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.access_token);
        alert('Login Berhasil!');
        router.push('/dashboard');
      } else {
        alert(`Gagal: ${result.message || 'Email atau Password salah'}`);
      }
    } catch (error) {
      alert('Gagal menyambung ke server Backend!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10 font-sans border-t-4 border-orange-500">
      {/* Header Plek Client */}
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
        Login
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Access your account to manage your journal proposals.
      </p>

      {/* Bar Dekoratif Identik Register */}
      <div className="flex justify-center items-center mb-8 bg-gray-100 rounded-full p-1 text-sm">
        <div className="flex-1 text-center py-2 rounded-full bg-orange-400 text-white font-bold shadow">
          Sign In to Your Account
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 gap-6">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Input your registered email"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                required
              />
            </div>

            {/* Input Password dengan Ikon Mata */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Input your password"
                  className="border p-3 rounded w-full focus:ring-2 focus:ring-orange-400 outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Forgot Password Link */}
              <div className="flex justify-end mt-2">
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Plek Style */}
        <div className="flex flex-col items-center mt-8 pt-6 space-y-4">
          <button
            type="submit"
            className="w-full md:w-1/2 px-8 py-3 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 transition-colors shadow-md uppercase tracking-wider"
          >
            LOGIN
          </button>
          
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-500 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}