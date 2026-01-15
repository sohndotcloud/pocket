'use client';

import { KeyboardEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

export default function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [headers, setHeaders] = useState<Headers|null>(null);
  const router = useRouter();

  const signUp = async () => {
    if (!supabase) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const response = await fetch("/api/signUp", {
        method: "POST",
        body: formData,
        credentials: "include"
      })
    setHeaders(headers)
    if (response.status === 200) {
      setMessage("Confirmation email has been sent.");
    }
    setLoading(false);
  };

  const getCookie = (name: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(name + '='))
    return cookie ? cookie.split('=')[1] : null
  }

  const signIn = async () => {
    if (!supabase) return
    setLoading(true)
    setMessage(null)
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password);
    const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
    setHeaders(headers)
    setLoading(false)
    if (response.status === 200) {
      router.push("/pocket");
    } else {
      setMessage("Invalid email and password.");
    }
  };

  const onEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (mode === 'signup') {
        signUp();
      } else {
        signIn();
      }
    }
  }

  useEffect(() => {
    const init = async () => {
      router.refresh();
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
      const client = createClient(url, key);
      setSupabase(client);
      client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      });
      const { data: { user } } = await supabase!.auth.getUser();
      
      if (user) {
        router.push('/pocket');
      }
    };

    init();
  }, []);

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 rounded-lg shadow-lg bg-gray-900 text-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {mode === 'signup' ? 'Create an Account on Pocket' : 'Welcome Back to Pocket'}
      </h2>

      {/* Tabs */}
      <div className="relative flex bg-gray-800 rounded-lg p-1 mb-6">
        <div
          className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-md bg-amber-700 transition-transform duration-300 ${
            mode === 'signup' ? 'translate-x-full' : ''
          }`}
        />

        <button
          onClick={() => setMode('signin')}
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition ${
            mode === 'signin' ? 'text-white' : 'text-gray-400'
          }`}
        >
          Sign In
        </button>

        <button
          onClick={() => setMode('signup')}
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition ${
            mode === 'signup' ? 'text-white' : 'text-gray-400'
          }`}
        >
          Sign Up
        </button>
      </div>

      <label className="block text-sm mb-1 text-gray-300">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={onEnter}
        placeholder="you@example.com"
        className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2"
      />

      {/* Password */}
      <label className="block text-sm mb-1 text-gray-300">Password</label>
      <input
        type="password"
        value={password}
        onKeyDown={onEnter}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full p-2 mb-6 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2"
      />

      {/* Submit */}
      <button
        onClick={mode === 'signup' ? signUp : signIn}
        disabled={loading}
        className="w-full bg-amber-700 py-2 rounded hover:bg-amber-700 transition disabled:opacity-50"
      >
        {loading
          ? 'Loading...'
          : mode === 'signup'
          ? 'Create Account'
          : 'Sign In'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}
