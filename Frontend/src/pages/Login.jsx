import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Role is usually returned by the backend, we don't need to pass it for login
      // but let's see if the authService expects it. Our authService: api.post('/auth/login', { email, password, role })
      // Actually, passing role might not be needed if the backend checks it, but let's pass a default or leave it.
      const response = await authService.login(formData.email, formData.password);
      dispatch(loginSuccess({ user: response.user, token: response.token }));
      
      const backendRole = response.user.role;
      const routeMap = {
        'RENTER': 'tenant',
        'OWNER': 'owner',
        'SERVICE': 'service',
        'INSPECTOR': 'inspector',
        'ADMIN': 'admin'
      };
      const dashboardPrefix = routeMap[backendRole] || 'tenant';

      localStorage.setItem('rentify_user_role', backendRole.toLowerCase() === 'renter' ? 'tenant' : backendRole.toLowerCase());
      
      toast.success('Welcome back!');
      navigate(`/${dashboardPrefix}-dashboard`);
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 flex items-center gap-2 text-white">
          <Building2 size={32} />
          <span className="text-2xl font-black tracking-tight">Rentify</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-black text-white mb-6 leading-tight">Your Smart Home,<br/>Simplified.</h1>
          <p className="text-blue-100 text-lg mb-8">Manage properties, track maintenance, and handle payments seamlessly in one platform.</p>
          
          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
            <p className="text-white italic mb-4">"Rentify completely transformed how I manage my properties. The automated payment tracking saves me hours every week."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-white">SK</div>
              <div>
                <div className="text-white font-bold text-sm">Sarah Khan</div>
                <div className="text-blue-200 text-xs">Property Owner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if(errors.email) setErrors({...errors, email: ''});
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500/50' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  } dark:text-white`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if(errors.password) setErrors({...errors, password: ''});
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500/50' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  } dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all focus:ring-4 focus:ring-blue-600/20 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 flex items-center before:flex-1 before:border-t before:border-slate-200 dark:before:border-slate-700 after:flex-1 after:border-t after:border-slate-200 dark:after:border-slate-700">
            <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Or continue with</span>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  const response = await authService.googleLogin(credentialResponse.credential);
                  dispatch(loginSuccess({ user: response.user, token: response.token }));
                  const backendRole = response.user.role;
                  const routeMap = { 'RENTER': 'tenant', 'OWNER': 'owner', 'SERVICE': 'service', 'INSPECTOR': 'inspector', 'ADMIN': 'admin' };
                  localStorage.setItem('rentify_user_role', backendRole.toLowerCase() === 'renter' ? 'tenant' : backendRole.toLowerCase());
                  toast.success('Welcome!');
                  navigate(`/${routeMap[backendRole] || 'tenant'}-dashboard`);
                } catch (err) {
                  console.error('Google login error:', err);
                  toast.error(err.response?.data?.error || 'Google login failed');
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => toast.error('Google login failed')}
              theme="outline"
              size="large"
              width="400"
              text="signin_with"
            />
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
